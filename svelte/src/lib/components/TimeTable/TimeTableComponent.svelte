<script>
    import {onMount, setContext} from "svelte";
    import {
        getCustomerBooking,
        initializeCustomerBooking
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {isToday, now, today} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatTimeAm, formatToTime} from "$lib/application/Formatter.js";
    import Calendar from "@event-calendar/core";
    import ResourceTimeGrid from "@event-calendar/resource-time-grid";
    import {
        findServiceBookingFromCustomerBooking
    } from "$lib/api/initialize_functions/customer-booking-utility-functions.js";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {business} from "$lib/page/stores/business/business.js";
    import ServicingTicketClickModal from "$lib/components/Timetable/TimetableModal/ServicingTicketClickModal.svelte";
    import {
        servicingTicketClickModal,
        servicingTicketClickModalOpen,
        servicingTicketClickModalSetEmployeeTimetableList
    } from "$lib/components/Timetable/TimetableModal/stores/servicingTicketClickModal.js";
    import {
        handleNewCustomerBookingWalkin
    } from "$lib/components/Modal/CreateCustomerBooking/modalCreateCustomerBooking.js";

    // Date select
    let prevSelectedDate = today(); // To help trigger fetch schedule
    let selectedDate = prevSelectedDate;
    let calendarInstance;

    let prevSelected = null;
    let prevSelectedServiceID = null;
    let prevEL = null;
    let prevInfoID = null;
    let conflictEmployeeEvents = {};
    let assignedEmployeeEvents = {};

    let plugins = [ResourceTimeGrid];

    let options = {
        view: "resourceTimeGridDay",
        views: {
            resourceTimeGridDay: {pointer: true},
        },
        allDaySlot: false,
        nowIndicator: isToday(selectedDate),
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
                    prevEL.className = `ec-event ${assignedEmployeeEvents[info.event.id] ? assignedEmployeeEvents[info.event.id] : ""} ${conflictEmployeeEvents[prevInfoID] ? conflictEmployeeEvents[prevInfoID] : ""}`;
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
                        prevEL.className = `ec-event ${assignedEmployeeEvents[info.event.id] ? assignedEmployeeEvents[info.event.id] : ""} ${conflictEmployeeEvents[prevInfoID] ? conflictEmployeeEvents[prevInfoID] : ""}`;
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
                info.el.className = `ec-event ${assignedEmployeeEvents[info.event.id] ? assignedEmployeeEvents[info.event.id] : ""} ${conflictEmployeeEvents[info.event.id] ? conflictEmployeeEvents[info.event.id] : ""}`;
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
                } else if (bookedEmployee !== null && bookedEmployee.id === employeeID) {
                    info.el.className = `ec-event border-4 border-black`;
                    assignedEmployeeEvents[info.event.id] = "border-4 border-black";
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


    $: if (prevSelectedDate !== selectedDate) {
        prevSelectedDate = selectedDate;
        options.nowIndicator = isToday(selectedDate);
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
            element.style.minWidth = "11rem";
        });

        const todayElements = document.querySelectorAll(".ec-day.ec-today");

        todayElements.forEach((element) => {
            element.style.background = "rgba(0,0,0,0.1)";
        });
    }

    async function openModalServicingTicket(eventInfo) {
        // Get the customer booking and service booking associated with the servicing ticket
        let customerBooking = await getCustomerBooking(
            eventInfo.event.extendedProps.servicingTicket.bookingID
        );
        let serviceBooking = findServiceBookingFromCustomerBooking(
            customerBooking,
            eventInfo.event.extendedProps.servicingTicket.serviceBookingID
        );

        // Pre-select the employee with the employee timetable that it is currently with
        //preselectEmployeeID = eventInfo.event.extendedProps.employeeTimetable.employee.id;

        // Open the servicing ticket modal
        servicingTicketClickModalOpen(customerBooking, serviceBooking);
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

    export let limitShowEvents = true;

    export function getDisplayBookingIDList(employeeTimetableList) {
        const uniqueBookingIDs = new Set();

        employeeTimetableList.forEach(employeeTable => {
            if (limitShowEvents) {
                // Filter to get only the COMPLETED bookings
                const completedTickets = employeeTable.servicingTicketList.filter(ticket =>
                    ticket.servicingTicketInfo.bookingState === CustomerBookingState.COMPLETED
                );

                // Get the last completed booking ID
                if (completedTickets.length > 0) {
                    const lastCompletedTicket = completedTickets[completedTickets.length - 1];
                    uniqueBookingIDs.add(lastCompletedTicket.bookingID);
                }

                // Add all other non-completed booking IDs
                employeeTable.servicingTicketList.forEach(servicingTicket => {
                    if (servicingTicket.servicingTicketInfo.bookingState !== CustomerBookingState.COMPLETED) {
                        uniqueBookingIDs.add(servicingTicket.bookingID);
                    }
                });
            } else {
                // Get all booking IDs
                employeeTable.servicingTicketList.forEach(servicingTicket => {
                    uniqueBookingIDs.add(servicingTicket.bookingID);
                });
            }
        });

        return Array.from(uniqueBookingIDs);
    }

    async function createEvents(employeeTimetableList) {
        const displayBookingIDList = getDisplayBookingIDList(employeeTimetableList);

        return employeeTimetableList.flatMap((employeeTable) =>
            employeeTable.servicingTicketList
                // Filter to only display the selected bookingID
                .filter(servicingTicket => displayBookingIDList.includes(servicingTicket.bookingID))
                // Create the events for the calendar
                .map((servicingTicket) =>
                {
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
            if (isToday(selectedDate)) {
                currentTimeString = $now.format(formatToTime);
            }

            console.log("selectedDate", selectedDate)

            const employeeTimetableList = await getSchedule(
                $business.businessInfo.businessID,
                selectedDate,
                currentTimeString
            );

            console.log("employeeTimetableList", employeeTimetableList);

            // Set the new employee timetable list
            servicingTicketClickModalSetEmployeeTimetableList(employeeTimetableList);

            // Fetch and reinitialize the customer booking for the modal
            if ($servicingTicketClickModal.open && $servicingTicketClickModal.customerBooking) {
                // Fetch the recent changes to the customer booking
                const fetchCustomerBooking = await getCustomerBooking($servicingTicketClickModal.customerBooking.bookingID)

                if (fetchCustomerBooking) {
                    // Get the latest service booking from the customer booking
                    let fetchServiceBooking = findServiceBookingFromCustomerBooking(
                        fetchCustomerBooking,
                        $servicingTicketClickModal.serviceBooking.serviceBookingID
                    );

                    servicingTicketClickModalOpen(fetchCustomerBooking, fetchServiceBooking);
                } else {
                    console.log('Customer booking not found for customer booking click modal.');
                }
            }

            // Generate the events for display
            employeeWorkHourEvent = [];
            resources = employeeTimetableList.flatMap((employeeTable) => {
                employeeWorkHourEvent.push({
                    resourceId: employeeTable.employee.id,
                    color: employeeTable.employee.id === -1 || !employeeTable.employee.id ? "red" : "#FFF9D0",
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
</script>

<div class="flex flex-col items-center justify-center p-1.5">
    <div class="flex items-center justify-center p-1.5">
        <input
                bind:value={selectedDate}
                type="date"
        />
        <button
                class="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
                on:click={fetchSchedule}
        >
            Refresh
        </button>
        <button class="text-blue-500 hover:text-blue-700 focus:outline-none" on:click={handleNewCustomerBookingWalkin}>
            <svg
                    class="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke-linecap="round"
                      stroke-linejoin="round"/>
            </svg>
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

<div style="z-index: 1006;">
    <ServicingTicketClickModal
            isToday={isToday(selectedDate)}
    />
</div>

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
