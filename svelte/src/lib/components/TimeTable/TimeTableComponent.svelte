<script>
    import {onMount, setContext} from "svelte";
    import {initializeCustomerBooking} from "$lib/api/api_server/lobby-portal/api.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatTimeAm, formatToDate, formatToTime, formatToTimeAm,} from "$lib/application/Formatter.js";
    import Calendar from "@event-calendar/core";
    import ResourceTimeGrid from "@event-calendar/resource-time-grid";
    import {Modal} from "flowbite-svelte";
    import {getCustomerBooking} from "$lib/api/api_server/customer-booking-portal/api.js";
    import dayjs from "dayjs";
    import CustomerIndividualServiceBookingComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualServiceBookingComponent/CustomerIndividualServiceBookingComponent.svelte";
    import {
        findIndividualBookingByID,
        findServiceBookingByID,
    } from "$lib/api/initialize_functions/customer-booking-utility-functions.js";
    import {
        moveToCompleted
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {business} from "$lib/page/protected/stores/business.js";
    import CustomerIndividualBookingComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualBookingComponent.svelte";

    // Date select
    let todayDate = $now.format(formatToDate);
    let prevSelectedDate = todayDate;
    let selectedDate = todayDate;
    let isToday = true;
    let calendarInstance;

    let prevSelected = null;
    let prevSelectedServiceID = null;
    let prevEL = null;
    let prevInfoID = null;
    let conflictEmployeeEvents = {};

    let plugins = [ResourceTimeGrid];

    let options = {
        view: "resourceTimeGridDay",
        views: {
            resourceTimeGridDay: {pointer: true},
        },
        allDaySlot: false,
        nowIndicator: isToday,
        dayMaxEvents: true,
        slotDuration: "00:05:00",
        scrollTime: $now.format("HH:mm:ss"),
        headerToolbar: {
            start: "",
            center: "",
            end: "",
        },
        resources: [],
        events: [],
        eventClick: function (info) {
            openModalServicingTicket(info);
        },
        eventAllUpdated: function () {
            findECBody();
        },
        eventMouseEnter: function (info) { //under weird circumstances, can be called infinitely when hovering over an event
            // until you move the mouse elsewhere. observed when an event occupies
            // very little time range.
            if (info.event.title !== "") {
                prevInfoID = info.event.id;
                let bookingID = info.event.extendedProps.servicingTicket.bookingID;
                let currServiceID =
                    info.event.extendedProps.servicingTicket.serviceBookingID;

                // calendar is slow in updating events so need these two checks to make sure the borders and highlight
                // dont stay on events that are not supposed to have them anymore
                if (prevSelectedServiceID && prevSelectedServiceID !== currServiceID) {
                    resetIndividualHighlight(prevSelectedServiceID);
                    prevEL.className = `ec-event ${conflictEmployeeEvents[prevInfoID] ? conflictEmployeeEvents[prevInfoID] : ""}`;
                }
                if (prevSelected && prevSelected !== bookingID) {
                    resetHighlight(prevSelected);
                }
                prevSelected = bookingID;
                prevSelectedServiceID = currServiceID;

                highlightRelatedEvents(bookingID);

                info.el.className = `ec-event border-2 border-black`;
                prevEL = info.el;
            } else {
                // bug where moving mouse quick between events can make highlight stick,
                // even when not hovering over any events (except work hour event, which has no title)
                // handled through extra checking
                if (prevSelected) {
                    resetHighlight(prevSelected);
                    prevSelected = null;
                }
                if (prevSelectedServiceID) {
                    resetIndividualHighlight(prevSelectedServiceID);

                    if (prevEL)
                        prevEL.className = `ec-event ${conflictEmployeeEvents[prevInfoID] ? conflictEmployeeEvents[prevInfoID] : ""}`;
                    prevEL = null;
                    prevSelectedServiceID = null;
                }


            }
        },
        eventMouseLeave: function (info) {
            if (info.event.title !== "") {
                prevEL = null;
                prevSelected = null;
                prevSelectedServiceID = null;

                let bookingID = info.event.extendedProps.servicingTicket.bookingID;
                resetHighlight(bookingID);
                info.el.className = `ec-event ${conflictEmployeeEvents[info.event.id] ? conflictEmployeeEvents[info.event.id] : ""}`;
            }
        },
        eventDidMount: function (info) {
            if (info.event.title !== "") {

                let extendedProps = info.event.extendedProps;
                let employeeID = extendedProps.employeeTimetable.employee.id;
                let bookedEmployee = extendedProps.servicingTicket.servicingTicketInfo.bookedEmployee;
                let conflicted = false;

                if (bookedEmployee !== null && bookedEmployee.id !== employeeID) {
                    conflicted = true;
                    conflictEmployeeEvents[info.event.id] = "border-2 border-red-600";
                    info.el.className = `ec-event border-2 border-red-600`;
                }

                info.el.innerHTML = buildInnerHTML(extendedProps.time, extendedProps.description);

                if (!conflicted && conflictEmployeeEvents[info.event.id]) {
                    delete conflictEmployeeEvents[info.event.id];
                }
            }

        }
    };

    function buildInnerHTML(time, description) {
        const timeDiv = `<div class="timeDivClass">${time}</div>`;
        const descriptionDiv = `<div class="text-sm text-ellipsis overflow-hidden ... whitespace-pre-line">${description}</div>`;

        return `<div class="flex flex-col">${timeDiv}${descriptionDiv}</div>`
    }


    $: if (
        prevSelectedDate &&
        selectedDate &&
        !dayjs(prevSelectedDate).isSame(selectedDate, "day")
    ) {
        prevSelectedDate = selectedDate;
        isToday = selectedDate === todayDate;
        options.nowIndicator = isToday;
        fetchSchedule();
    }

    function highlightRelatedEvents(bookingID) {
        const allEvents = calendarInstance.getEvents();
        allEvents.forEach((event) => {
            if (
                event.extendedProps.servicingTicket &&
                event.extendedProps.servicingTicket.bookingID === bookingID
            ) {
                event.backgroundColor = "#7d5821";

                calendarInstance.updateEvent(event);
            }
        });
    }

    function resetHighlight(bookingID) {
        const allEvents = calendarInstance.getEvents();
        allEvents.forEach((event) => {
            if (
                event.extendedProps.servicingTicket &&
                event.extendedProps.servicingTicket.bookingID === bookingID
            ) {
                event.backgroundColor = bookingStateColour(
                    event.extendedProps.servicingTicket
                );
                calendarInstance.updateEvent(event);
            }
        });
    }

    function resetIndividualHighlight(serviceBookingID) {
        const allEvents = calendarInstance.getEvents();
        allEvents.forEach((event) => {
            if (
                event.extendedProps.servicingTicket &&
                event.extendedProps.servicingTicket.serviceBookingID ===
                serviceBookingID
            ) {
                event.backgroundColor = bookingStateColour(
                    event.extendedProps.servicingTicket
                );
                calendarInstance.updateEvent(event);
            }
        });
    }

    function findECBody() {
        const element = document.querySelector(".ec-body");

        if (element) {
            element.style.overflowX = "hidden";
            element.style.overflowY = "auto";
            element.style.scrollbarWidth = "auto";
            element.style.scrollbarColor = "white ";
        }

        const resourceElements = document.querySelectorAll(".ec-resource");

        resourceElements.forEach((element) => {
            element.style.minWidth = "150px";
        });

        const todayElements = document.querySelectorAll(".ec-day.ec-today");

        todayElements.forEach((element) => {
            element.style.background = "rgba(0,0,0,0.1)";
        });
    }

    let openModal = false;
    let eventInfo = undefined;
    let customerBooking = undefined;
    let serviceBooking = undefined;
    let preselectEmployeeID = undefined;
    let indicateToSendCustomerBookingToCompleted = false;
    let individualModalBooking;

    async function openModalServicingTicket(info) {

        // Track the event servicing ticket that got clicked
        eventInfo = info;

        // Get the customer booking and service booking associated with the servicing ticket
        customerBooking = await getCustomerBooking(
            eventInfo.event.extendedProps.servicingTicket.bookingID
        );
        individualModalBooking = findIndividualBookingByID(
            customerBooking,
            eventInfo.event.extendedProps.servicingTicket.individualID
        );
        serviceBooking = findServiceBookingByID(
            individualModalBooking,
            eventInfo.event.extendedProps.servicingTicket.serviceBookingID
        );

        // Pre-select the employee with the employee timetable that it is currently with
        preselectEmployeeID = eventInfo.event.extendedProps.employeeTimetable.employee.id;

        // Indicate to send the customer booking to completed
        // It must be under servicing
        indicateToSendCustomerBookingToCompleted = false;
        if (customerBooking.bookingState === CustomerBookingState.SERVICING) {
            // Get the service booking list
            let serviceBookingList = customerBooking.customerIndividualBookingList.map(
                individualBooking => individualBooking.customerIndividualServiceBookingList
            ).flat();

            // Count completed and currently servicing bookings
            let incompleteServiceBookingCount = 0;
            let incompleteServicingTicketCount = 0;
            serviceBookingList.forEach((serviceBooking) => {
                if (!serviceBooking.completed) {
                    incompleteServiceBookingCount += 1;

                    // Check if there is only one servicing ticket that is not completed
                    if (serviceBooking.servicingTicketList.length > 0) {
                        serviceBooking.servicingTicketList.forEach((servicingTicket) => {
                            if (!servicingTicket.completed) {
                                incompleteServicingTicketCount += 1;
                            }
                        })
                    }
                }
            });

            // All service bookings are completed or only one left, and it is currently being servicing
            if (incompleteServiceBookingCount === 0 || (incompleteServiceBookingCount === 1 && incompleteServicingTicketCount === 1)) {
                indicateToSendCustomerBookingToCompleted = true;
            }
        }

        // Open the servicing ticket modal
        openModal = true;
    }

    let employeeEvents = [];
    let employeeWorkHourEvent = [];
    let resources = [];
    let loading = true;

    function bookingStateColour(servicingTicket) {
        let servicingTicketColor = "#3399ff"; // Light blue, appointment state
        // Lobby
        if (servicingTicket.servicingTicketInfo.bookingState === CustomerBookingState.LOBBY) {
            servicingTicketColor = "#FFC300";
        }
        // Ongoing servicing
        else if (servicingTicket.servicingTicketInfo.bookingState === CustomerBookingState.SERVICING) {
            // In servicing queue waiting to be service
            servicingTicketColor = "#90ee90";

            // In the case of servicing ticket is completed
            if (servicingTicket.isCompleted) {
                servicingTicketColor = "gray";
            }
            // The ticket is currently being service
            else if (servicingTicket.isOngoing) {
                servicingTicketColor = "#29c029";
            }
        }
        // Completed
        else if (servicingTicket.servicingTicketInfo.bookingState === CustomerBookingState.COMPLETED) {
            servicingTicketColor = "gray";
        }

        return servicingTicketColor;
    }

    async function createEvents(employeeTimetableList) {
        return employeeTimetableList.flatMap((employeeTable) =>
            employeeTable.servicingTicketList.map((servicingTicket) => {
                // Servicing ticket colour
                let servicingTicketColor = bookingStateColour(servicingTicket);

                return {
                    // Event variables
                    start: `${$now.format("YYYY-MM-DD")} ${servicingTicket.timePeriod.startTime}`,
                    end: `${$now.format("YYYY-MM-DD")} ${servicingTicket.timePeriod.endTime}`,
                    resourceId: employeeTable.employee.id,
                    title: ` `,

                    // Ticket state
                    color: servicingTicketColor,

                    // Booking information
                    extendedProps: {
                        employeeTimetable: employeeTable,
                        servicingTicket: servicingTicket,
                        description: `${servicingTicket.servicingTicketInfo.service.serviceName}\n(${servicingTicket.servicingTicketInfo.customerName})`,
                        time: `${formatTimeAm(servicingTicket.timePeriod.startTime)} - ${formatTimeAm(servicingTicket.timePeriod.endTime)}`
                    },
                };
            })
        );
    }

    export let getSchedule;

    async function fetchSchedule() {
        loading = true;

        try {
            // Get the current time based on if it is today
            let currentTimeString = "00:00";
            if (isToday) {
                currentTimeString = $now.format(formatToTime);
            }

            const employeeTimetableList = await getSchedule(
                $business.businessInfo.businessID,
                selectedDate,
                currentTimeString
            );

            console.log("employeeTimetableList", employeeTimetableList);

            employeeWorkHourEvent = [];
            resources = employeeTimetableList.flatMap((employeeTable) => {
                employeeWorkHourEvent.push({
                    resourceId: employeeTable.employee.id,
                    color: employeeTable.employee.id === -1 ? "red" : "#FFF9D0",
                    start: `${$now.format("YYYY-MM-DD")} ${employeeTable.timePeriod.startTime}`,
                    end: `${$now.format("YYYY-MM-DD")} ${employeeTable.timePeriod.endTime}`,
                    display: "background",
                });
                return {
                    id: employeeTable.employee.id,
                    title: `${employeeTable.employee.employeeName}`,
                };
            });

            employeeEvents = await createEvents(employeeTimetableList);

            options.resources = resources;
            options.events = employeeWorkHourEvent.concat(employeeEvents);

            if (options.events.length === 0) {
                setTimeout(function () {
                    findECBody();
                }, 50);
            }
        } catch (error) {
            console.error("Failed to  fetch tasks", error);
            employeeEvents = [];
            resources = [];
            employeeWorkHourEvent = [];
        }

        loading = false;
    }

    onMount(async () => {
        try {
            await fetchSchedule();
        } catch (err) {
            console.error("Failed to fetch schedule", err);
        }
    });

    async function submitCustomerBooking(customerBooking) {
        // Submit the change to the server
        await initializeCustomerBooking(customerBooking);

        // Update the schedule
        await fetchSchedule();
    }

    setContext("submitCustomerBooking", submitCustomerBooking);

    async function handleCompletedClick() {
        console.log("Moving to completed:", customerBooking);

        await moveToCompleted($now, customerBooking, submitCustomerBooking);
    }
</script>
<style>
    :global(.ec-event-time) {
        display: none;
    }

    :global(.timeDivClass) {
        color: white;
        /*text-shadow:*/
        /*        -0.4px -0.4px 0 #000,*/
        /*        0.4px -0.4px 0 #000,*/
        /*        -0.4px 0.4px 0 #000,*/
        /*        0.4px 0.4px 0 #000;*/

    }
</style>
<div class="flex flex-col items-center justify-center p-1.5">
    <div class="flex items-center justify-center p-1.5">
        <input
                bind:value={selectedDate}
                min={$now.format(formatToDate)}
                type="date"
        />
        <button
                class="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
                on:click={fetchSchedule}
        >
            Refresh
        </button>
    </div>

    <!-- Legend for color coding -->
    <div
            class="legend flex justify-around items-center w-full p-2 bg-white shadow rounded-lg mb-1"
    >
        <div class="flex items-center">
            <span class="block w-4 h-4 bg-blue-500 mr-2"></span>
            <span class="text-sm">Appointment (Light Blue)</span>
        </div>
        <div class="flex items-center">
            <span class="block w-4 h-4 bg-yellow-300 mr-2"></span>
            <span class="text-sm">Lobby (Yellow)</span>
        </div>
        <div class="flex items-center">
            <span class="block w-4 h-4 bg-green-400 mr-2"></span>
            <span class="text-sm">In Progress (Green)</span>
        </div>
        <div class="flex items-center">
            <span class="block w-4 h-4 bg-gray-400 mr-2"></span>
            <span class="text-sm">Completed (Gray)</span>
        </div>
    </div>
</div>

{#if !loading}
    <div
            class="flex flex-col items-center justify-center w-4/5 h-4/5 mx-auto overflow-x-auto"
    >
        <div class="flex h-full m-auto">
            <Calendar bind:this={calendarInstance} {plugins} {options}/>
        </div>
    </div>
{/if}

<div class="absolute top-0 left-0 right-0" style="z-index: 1006;">
    <Modal autoclose bind:open={openModal} outsideclose size="md" >
        <div>
            <p>
                <strong>Customer name:</strong>
                {customerBooking.customer.customerName}
            </p>
            <p>
                <strong>Booking time:</strong>
                {dayjs(customerBooking.bookingTime, formatToTime).format(
                    formatToTimeAm
                )}
            </p>
            <p>
                <strong>Number of guest(s):</strong>
                {customerBooking.customerIndividualBookingList.length}
            </p>
            <p class="break-words">
                <strong>Message:</strong>
                {customerBooking.message}
            </p>

            <div class="mt-1 p-1">
                <div class="font-bold">Selected service:</div>

                {#if customerBooking.bookingState !== 3 && isToday}
                    <div class="border-2 border-green-400 rounded-md">
                        <CustomerIndividualServiceBookingComponent
                                {customerBooking}
                                {serviceBooking}
                                {preselectEmployeeID}
                        />
                    </div>
                    {#if individualModalBooking.customerIndividualServiceBookingList.length > 1}
                        <div class="font-bold mt-2">Other services for this guest:</div>
                        <div class="">
                            {#each individualModalBooking.customerIndividualServiceBookingList as booking}
                                {#if serviceBooking.serviceBookingID !== booking.serviceBookingID}
                                    <CustomerIndividualServiceBookingComponent
                                            {customerBooking}
                                            serviceBooking={booking}
                                            {preselectEmployeeID}
                                    />
                                {/if}
                            {/each}
                        </div>
                    {/if}
                    {#if customerBooking.customerIndividualBookingList.length > 1}
                        <div class="mt-6">
                            <div class="font-bold">Other related guest(s) for this booking:</div>
                            {#each customerBooking.customerIndividualBookingList as individualBooking (individualBooking.individualID)}
                                {#if individualBooking.individualID !== individualModalBooking.individualID }
                                    <CustomerIndividualBookingComponent
                                            {customerBooking}
                                            {individualBooking}
                                            specificBooking={serviceBooking}
                                    />
                                {/if}
                            {/each}
                        </div>
                    {/if}


                {:else}
                    <p>{serviceBooking.service.serviceName}</p>
                {/if}
            </div>
        </div>

        <svelte:fragment slot="footer">
            <div class="w-full mt-4 flex justify-end items-center space-x-2">
                <span class="text-gray-700 font-bold">Move to:</span>
                {#if indicateToSendCustomerBookingToCompleted}
                    <button
                            class="animate-pulse bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            on:click={handleCompletedClick}>Complete
                    </button
                    >
                {:else}
                    <button
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            on:click={handleCompletedClick}>Complete
                    </button
                    >
                {/if}
            </div>
        </svelte:fragment>
    </Modal>
</div>
