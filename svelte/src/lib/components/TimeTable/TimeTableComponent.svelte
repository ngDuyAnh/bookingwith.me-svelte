<script>
    import {isPast, isToday, now, nowTime, today,} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatTimeAm, formatToTime} from "$lib/application/Formatter.js";
    import Calendar from "@event-calendar/core";

    import Interaction from "@event-calendar/interaction";
    import ResourceTimeGrid from "@event-calendar/resource-time-grid";

    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import ServicingTicketClickModal
        from "$lib/components/TimeTable/ServicingTicketClickModal/ServicingTicketClickModal.svelte";
    import {
        handleTimetableUpdateForServicingTicketClickModal,
        servicingTicketClickModalOpenWithServicingTicketEventInfo,
    } from "$lib/components/TimeTable/ServicingTicketClickModal/stores/servicingTicketClickModal.js";
    import {
        handleNewCustomerBookingWalkin
    } from "$lib/components/Modal/CreateCustomerBooking/modalCreateCustomerBooking.js";
    import {fetchTimetable, timetableComponent,} from "$lib/components/TimeTable/stores/timetableComponent.js";
    import {onMount} from "svelte";
    import {Button, Search, Spinner} from "flowbite-svelte";
    import {SearchOutline} from "flowbite-svelte-icons";
    import dayjs from "dayjs";
    import {findCustomerBookingById} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {
        findServiceBookingFromCustomerBooking
    } from "$lib/api/initialize_functions/utilitiy_functions/CustomerBooking.js";
    import {
        initializeCustomerBookingAndBroadcast
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {business, getEmployee} from "$lib/page/stores/business/business.js";

    // Date select
    let selectedDate = today();

    let calendarInstance;
    let loading = true;

    let prevSelected = null;
    let prevSelectedServiceID = null;
    let prevEL = null;
    let prevInfoID = null;
    let conflictEmployeeEvents = {};
    let assignedEmployeeEvents = {};

    let plugins = [ResourceTimeGrid, Interaction];

    let dragStartTime;
    let dragDuration;

    let options = {
        editable: true,
        eventStartEditable: true,
        eventDurationEditable: true,
        view: "resourceTimeGridDay",
        selectable: true,
        allDaySlot: false,
        headerToolbar: {
            start: "",
            center: "",
            end: "",
        },
        nowIndicator: isToday(selectedDate),
        dayMaxEvents: true,
        slotDuration: "00:05:00",
        scrollTime: $now.format("HH:mm:ss"),
        eventClick: (info) => {
            servicingTicketClickModalOpenWithServicingTicketEventInfo(info);
        },
        events: [],
        resources: [],
        eventLongPressDelay: 500,
        eventAllUpdated: function () {
            findECBody();
        },
        eventDidMount: function (info) {
            if (info.event.title !== "") {
                let extendedProps = info.event.extendedProps;
                let employeeID = extendedProps.employeeTimetable.employee.id;
                let bookedEmployee =
                    extendedProps.servicingTicket.servicingTicketInfo.bookedEmployee;
                let conflicted = false;
                if (bookedEmployee !== null && bookedEmployee.id !== employeeID) {
                    conflicted = true;
                    conflictEmployeeEvents[info.event.id] = "border-2 border-red-600";
                    info.el.className = `ec-event border-2 border-red-600`;
                } else if (
                    bookedEmployee !== null &&
                    bookedEmployee.id === employeeID
                ) {
                    info.el.className = `ec-event border-4 border-black`;
                    assignedEmployeeEvents[info.event.id] = "border-4 border-black";
                }

                const timeDiv = `<div class="text-sm font-semibold">${extendedProps.time}</div>`;
                const descriptionDiv = `<div class="text-sm text-ellipsis overflow-hidden ... whitespace-pre-line">${extendedProps.description}</div>`;

                const tempDiv = document.createElement("div"); // Create a temporary DIV
                tempDiv.innerHTML = `<div class="flex flex-col w-full ">${timeDiv}${descriptionDiv}</div>`;

                const firstChild = info.el.firstChild; // Get the first child of the element
                while (tempDiv.firstChild) {
                    info.el.insertBefore(tempDiv.firstChild, firstChild);
                }

                if (!conflicted && conflictEmployeeEvents[info.event.id]) {
                    delete conflictEmployeeEvents[info.event.id];
                }
            }
        },
        eventMouseEnter: function (info) {
            //under weird circumstances, can be called infinitely when hovering over an event
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
        eventResize: function (info) {
            let startTime = dayjs(info.event.start);
            let endTime = dayjs(info.event.end);

            let totalDuration = endTime.diff(startTime, "minute");


            let currTicketID = info.event.extendedProps.servicingTicket.ticketID;
            let currServiceBookingID = info.event.extendedProps.servicingTicket.serviceBookingID;


            const allEvents = calendarInstance.getEvents();
            allEvents.forEach((event) => {
                if (
                    event.extendedProps.servicingTicket &&
                    event.extendedProps.servicingTicket.ticketID !== currTicketID &&
                    event.extendedProps.servicingTicket.serviceBookingID === currServiceBookingID
                ) {
                    startTime = dayjs(event.start);
                    endTime = dayjs(event.end);
                    totalDuration += endTime.diff(startTime, "minute");
                }
            });

            let serviceBooking = undefined;
            let customerBookingId = info.event.extendedProps.servicingTicket.servicingTicketInfo.id;
            let customerBooking = findCustomerBookingById(customerBookingId);
            if (customerBooking) {
                serviceBooking = findServiceBookingFromCustomerBooking(
                    customerBooking,
                    currServiceBookingID
                );

                serviceBooking.servicingDuration=totalDuration;
                initializeCustomerBookingAndBroadcast(customerBooking, nowTime());
            }

        },
        eventDragStart: function(info){
            console.log("eventDragStart, info", info);
            // info.event.backgroundColor="rgb(255,255,255)";

            const element = document.querySelectorAll(".ec-preview");

            element.forEach((element) => {
                element.style.backgroundColor = "rgb(255,255,255) !important";
            });

            console.log("element is", element);

            dragStartTime = dayjs();
        },
        eventDragStop: function(){

            const dragEndTime = dayjs();
            dragDuration = dragEndTime.diff(dragStartTime); // Duration in millisecond
        },
        eventDrop: function (info) {
            let startTime = dayjs(info.event.start).format(formatToTime);


            let currServiceBookingID = info.event.extendedProps.servicingTicket.serviceBookingID;



            let serviceBooking = undefined;
            let customerBookingId = info.event.extendedProps.servicingTicket.servicingTicketInfo.id;
            let customerBooking = findCustomerBookingById(customerBookingId);
            if (customerBooking) {
                serviceBooking = findServiceBookingFromCustomerBooking(
                    customerBooking,
                    currServiceBookingID
                );

                if(info.newResource)
                {
                    const employee=getEmployee(parseInt(info.newResource.id, 10));
                    if(employee)
                    {
                        serviceBooking.assignedEmployee=employee;
                    }
                }

                // Only set the start time if the drag duration was more than 1 second (1000 milliseconds)
                if (dragDuration > 1000) {
                    serviceBooking.startTime = startTime;
                }
                else
                {
                    serviceBooking.startTime = null;
                }

                initializeCustomerBookingAndBroadcast(customerBooking, nowTime());
            }

        },

    };

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

        const eventTime = document.querySelectorAll(".ec-event-body");

        eventTime.forEach((element) => {
            element.style.display = "none";
        });

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

    function bookingStateColour(servicingTicket) {
        let servicingTicketColor = "#3399ff"; // Light blue, appointment state
        // Lobby
        if (
            servicingTicket.servicingTicketInfo.bookingState ===
            CustomerBookingState.LOBBY
        ) {
            servicingTicketColor = "#FFC300";
        }
        // Ongoing servicing
        else if (
            servicingTicket.servicingTicketInfo.bookingState ===
            CustomerBookingState.SERVICING
        ) {
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
        else if (
            servicingTicket.servicingTicketInfo.bookingState ===
            CustomerBookingState.COMPLETED
        ) {
            servicingTicketColor = "gray";
        }

        return servicingTicketColor;
    }

    export let limitShowEvents = true;
    export let restrictedPast = true;

    // $: console.log(`Now time ${$now.format(formatToTime)}`);
    // $: console.log("$timetableComponent", $timetableComponent);

    onMount(async () => {
        await fetchTimetable(selectedDate);
    });

    // Date select change
    // Or current time change if it is today
    $: if (
        $timetableComponent.date !== selectedDate ||
        (isToday($timetableComponent.date) &&
            $timetableComponent.currentTime !== $now.format(formatToTime))
    ) {
        // Now indicator for today
        options.nowIndicator = isToday(selectedDate);

        // Fetch the timetable
        if (!restrictedPast || (restrictedPast && !isPast(selectedDate))) {
            (async () => {
                await fetchTimetable(selectedDate);
            })();
        } else {
            timetableComponent.set({
                date: selectedDate,
                currentTime: "23:59",
                employeeTimetableList: [],
            });
        }
    }

    let searchValue = "";
    let showSearchText = "";
    let filteredEmployeeTimetableList = $timetableComponent.employeeTimetableList;

    function normalize(text) {
        return text.replace(/[\W_]+/g, "").toLowerCase();
    }

    function searchBookings() {
        const normalizedSearchValue = normalize(searchValue);

        if (searchValue.length === 0) {
            // Reset the scroll to current time
            // console.log("here?");
            // options.scrollTime = $now.format("HH:mm:ss");

            filteredEmployeeTimetableList = $timetableComponent.employeeTimetableList;
            showSearchText = "";
        } else {
            filteredEmployeeTimetableList = $timetableComponent.employeeTimetableList
                .map((employeeTimetable) => {
                    return {
                        ...employeeTimetable,
                        servicingTicketList: employeeTimetable.servicingTicketList.filter(
                            (ticket) =>
                                normalize(ticket.servicingTicketInfo.phoneNumber).includes(
                                    normalizedSearchValue
                                ) ||
                                normalize(ticket.servicingTicketInfo.customerName).includes(
                                    normalizedSearchValue
                                ) ||
                                normalize(ticket.servicingTicketInfo.id.toString()).includes(
                                    normalizedSearchValue
                                )
                        ),
                    };
                })
                .filter(
                    (employeeTimetable) =>
                        employeeTimetable.servicingTicketList.length > 0
                );

            // Find the earliest non-completed servicing ticket
            let earliestServicingTicketStartTimeNotCompleted = undefined;
            filteredEmployeeTimetableList.forEach((timetable) => {
                timetable.servicingTicketList.forEach((ticket) => {
                    if (
                        ticket.servicingTicketInfo.bookingState !==
                        CustomerBookingState.COMPLETED
                    ) {
                        if (
                            !earliestServicingTicketStartTimeNotCompleted ||
                            ticket.timePeriod.startTime <
                            earliestServicingTicketStartTimeNotCompleted
                        ) {
                            earliestServicingTicketStartTimeNotCompleted =
                                ticket.timePeriod.startTime;
                        }
                    }
                });
            });

            // Scroll to the start time
            if (earliestServicingTicketStartTimeNotCompleted) {
                options.scrollTime = `${earliestServicingTicketStartTimeNotCompleted}:00`;
            }

            showSearchText = `Showing Results For: ${searchValue}`;
        }
    }

    // Searching input changes
    // Timetable update generate events for calendar
    $: if (searchValue.length >= 0 || $timetableComponent.employeeTimetableList) {
        // Apply search filter
        searchBookings();

        // Generate the events for the calendar
        updateCalendarEvents(filteredEmployeeTimetableList);
    }

    let employeeEvents = [];
    let employeeWorkHourEvent = [];
    let resources = [];

    async function updateCalendarEvents(employeeTimetableList) {
        // loading = true;

        handleTimetableUpdateForServicingTicketClickModal(
            employeeTimetableList
        ).then(() => {
            //console.log("handleTimetableUpdateForServicingTicketClickModal() completed.");
        });

        // Generate the events for display
        employeeWorkHourEvent = [];
        resources = employeeTimetableList.flatMap((employeeTable) => {
            employeeWorkHourEvent.push({
                resourceId: employeeTable.employee.id,
                color:
                    employeeTable.employee.id === -1 || !employeeTable.employee.id
                        ? "red"
                        : "#FFF9D0",
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
        // options.events = employeeEvents;

        // loading = false;
        if (options.events.length === 0) {
            setTimeout(function () {
                findECBody();
            }, 50);
        }
    }

    export function getDisplayBookingIDList(employeeTimetableList) {
        const uniqueBookingIDs = new Set();

        employeeTimetableList.forEach((employeeTable) => {
            if (limitShowEvents) {
                // Filter to get only the COMPLETED bookings
                const completedTickets = employeeTable.servicingTicketList.filter(
                    (ticket) =>
                        ticket.servicingTicketInfo.bookingState ===
                        CustomerBookingState.COMPLETED
                );

                // Get the last completed booking ID
                if (completedTickets.length > 0) {
                    const lastCompletedTicket =
                        completedTickets[completedTickets.length - 1];
                    uniqueBookingIDs.add(lastCompletedTicket.bookingID);
                }

                // Add get-by-month other non-completed booking IDs
                employeeTable.servicingTicketList.forEach((ticket) => {
                    if (
                        ticket.servicingTicketInfo.bookingState !==
                        CustomerBookingState.COMPLETED
                    ) {
                        uniqueBookingIDs.add(ticket.bookingID);
                    }
                });
            } else {
                // Get get-by-month booking IDs
                employeeTable.servicingTicketList.forEach((servicingTicket) => {
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
                .filter((servicingTicket) =>
                    displayBookingIDList.includes(servicingTicket.bookingID)
                )
                // Create the events for the calendar
                .map((servicingTicket) => {
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
                            time: `${formatTimeAm(servicingTicket.timePeriod.startTime)} - ${formatTimeAm(servicingTicket.timePeriod.endTime)}`,
                        },
                    };
                })
        );
    }
</script>

<div class="flex flex-col items-center justify-center p-1.5">
    <div class="flex items-center justify-center p-1.5">
        <input bind:value={selectedDate} type="date"/>
        <button
                class="text-blue-500 hover:text-blue-700 focus:outline-none"
                on:click={handleNewCustomerBookingWalkin}
        >
            <svg
                    class="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
            >
                <path
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                />
            </svg>
        </button>
    </div>

    <div
            class="flex sm:flex-row flex-col sm:items-center items-start justify-start sm:space-x-4 pt-4 px-4 2xl:items-center 2xl:justify-center"
    >
        <form class="flex max-w-xs items-center" on:submit={searchBookings}>
            <Search
                    bind:value={searchValue}
                    size="md"
                    class="rounded-none rounded-l-lg py-2.5"
                    placeholder="Search Booking Info"
                    maxlength="20"
            ></Search>
            <Button type="submit" class="!p-2.5 rounded-s-none">
                <SearchOutline class="w-5 h-5"/>
            </Button>
        </form>

        <div class="!flex !flex-col">
            <strong class="sm:my-0 mt-1 text-sm">{showSearchText}</strong>
        </div>
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
<div
        class="flex flex-col items-center justify-center w-4/5 h-4/5 mx-auto overflow-x-auto"
>
    <div class="flex h-full m-auto">

        <Calendar bind:this={calendarInstance} {plugins} {options}/>
    </div>
</div>
<div style="z-index: 1006;">
    <ServicingTicketClickModal isToday={isToday(selectedDate)}/>
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

    :global(.ec-preview) {
        background-color: rgba(255, 0, 0, 0.34) !important;
    }
</style>
