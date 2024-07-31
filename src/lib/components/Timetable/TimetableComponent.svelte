<script>
    import {isPast, isToday, now, nowTime, today} from "$lib/page/stores/business/business.js";
    import {formatTimeAm, formatToDate, formatToTime,} from "$lib/application/Formatter.js";
    import Calendar from "@event-calendar/core";
    import {
        ChevronLeftOutline,
        ChevronRightOutline,
        InfoCircleSolid,
        PlusOutline,
        SearchOutline,
    } from "flowbite-svelte-icons";

    import Interaction from "@event-calendar/interaction";
    import ResourceTimeGrid from "@event-calendar/resource-time-grid";

    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import ServicingTicketClickModal
        from "$lib/components/Modal/ServicingTicketClickModal/ServicingTicketClickModal.svelte";
    import {
        handleTimetableUpdateForServicingTicketClickModal,
        servicingTicketClickModalOpenWithServicingTicketEventInfo,
    } from "$lib/components/Modal/ServicingTicketClickModal/stores/servicingTicketClickModal.js";
    import {
        fetchTimetable, findEmployeeTimetable,
        timetableComponent,
        timetableSortServiceBookingList
    } from "$lib/components/Timetable/stores/timetableComponent.js";
    import {onMount} from "svelte";
    import {Button, DropdownDivider, Popover, Search} from "flowbite-svelte";
    import dayjs from "dayjs";
    import {findCustomerBookingById} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {
        findIndividualBookingFromCustomerBooking,
        findServiceBookingFromCustomerBooking,
        shortCustomerBookingID,
    } from "$lib/api/utilitiy_functions/CustomerBooking.js";
    import {
        getCustomerBooking,
        initializeCustomerBookingAndBroadcast
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {business, getEmployee} from "$lib/page/stores/business/business.js";
    import {normalizeSearchInput} from "$lib/application/NormalizeSearchInput.js";
    import {findEmployeeFromBusinessUsingEmployeeID} from "$lib/api/utilitiy_functions/Business.js";
    import {
        handleOpenEmployeeTimetableModal
    } from "$lib/components/Modal/EmployeeTimetableModal/stores/employeeTimetableModal.js";
    import EmployeeTimetableModal from "$lib/components/Modal/EmployeeTimetableModal/EmployeeTimetableModal.svelte";
    import {
        deleteEmployeeTimetableBlockTicket,
        initializeEmployeeTimetableBlockTicket
    } from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {getEndTime} from "$lib/api/initialize_functions/TimePeriod.js";
    import {
        handleNewCustomerBookingLobbyModalForLobby
    } from "$lib/components/Modal/CustomerBookingLobbyModal/stores/customerBookingLobbyModal.js";

    // Date select
    let selectedDate = today();

    let calendarInstance;

    let conflictEmployeeEvents = {};
    let assignedEmployeeEvents = {};

    let plugins = [ResourceTimeGrid, Interaction];

    // Allow to edit the timetable
    export let editable = true;
    export let ableToAssignEmployeeToServicingTicket = true;

    let options = {
        editable: editable,
        eventStartEditable: editable,
        eventDurationEditable: editable,
        view: "resourceTimeGridDay",
        selectable: true,
        allDaySlot: false,
        dayMinWidth: 150, // will cause horizontal scrollbars
        headerToolbar: {
            start: "",
            center: "",
            end: "",
        },
        resourceLabelContent: function (info) {
            // console.log("resourceLabelContent", info);

            // Return HTML with a unique identifier, such as a data attribute
            return {
                html: `<button id="resource-label-${info.resource.id}" class="resource-label hoverable flex flex-row items-center justify-center w-full h-full">
                  ${info.resource.title.html}
               </button>`,
            };
        },
        height: "auto",
        nowIndicator: isToday(selectedDate),
        dayMaxEvents: true,
        slotDuration: "00:05:00",
        scrollTime: $now.format("HH:mm:ss"),
        eventClick: (info) => {
            if(info.event && info.event.extendedProps?.description !== "Blocked") {
                servicingTicketClickModalOpenWithServicingTicketEventInfo(info);
            }
        },
        events: [],
        resources: [],
        eventLongPressDelay: 500,
        slotEventOverlap: false,
        slotLabelFormat: function (time) {
            // Extract hours and minutes using getHours() and getMinutes()
            let hours = time.getHours();
            let minutes = time.getMinutes();

            // Determine AM or PM
            let ampm = hours >= 12 ? "PM" : "AM";
            // Convert 24-hour time to 12-hour format
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'

            // Format for Full Hours
            if (minutes === 0) {
                return {
                    html: `<span class="font-extrabold text-sm">${hours}:00 ${ampm}</span>`,
                };
                // Format for Half Hours
            } else if (minutes === 30) {
                return {
                    html: `<span class="text-sm">${hours}:30 ${ampm}</span>`,
                };
                // Format for Other Times
            } else {
                let minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
                return {
                    html: `<span class="text-xs" >${hours}:${minutesFormatted} ${ampm}</span>`,
                };
            }
        },
        eventAllUpdated: function () {
            findECBody();
        },
        eventDidMount: async function (info) {
            if (info.event.title !== "") {

                let iconCombination = ``;
                const employeeAssignedSVG = `<div class="tooltip-container">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-[15px] h-[15px] text-blue-800" viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                                                                        <path fill="currentColor" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM625 177L497 305c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L591 143c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                                                                                        </svg>
                                                                                         <span class="tooltip">Employee assigned</span>
                                            </div>`;
                const employeeNotAssignedSVG = `<div class="tooltip-container">
                                               <svg xmlns="http://www.w3.org/2000/svg" class="w-[15px] h-[15px] text-red-500" fill="currentColor" viewBox="0 0 640 512">
                                                 <path fill="currentColor" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM471 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
                                               </svg>
                                               <span class="tooltip">No employee assigned</span>
                                             </div>`;
                // console.log("mounted");
                let extendedProps = info.event.extendedProps;
                let isBlocked = extendedProps.description == "Blocked";

                let highlight=false;

                let conflicted = false;
                // console.log("assigned employee", info.event);

                if (!isBlocked) {
                    let employeeID = extendedProps.employeeTimetable.employee.id;
                    let bookedEmployee =
                        extendedProps.servicingTicket.servicingTicketInfo.bookedEmployee;

                    const customerBookingId =
                        extendedProps.servicingTicket.servicingTicketInfo.id;
                    const customerBookingBookingID = extendedProps.servicingTicket.bookingID;
                    const serviceBookingID = extendedProps.servicingTicket.serviceBookingID;


                    // Get the customer booking instance
                    // If it is today, can get it from queue list from dashboard
                    // Otherwise has to fetch from the backend
                    let customerBooking = undefined;
                    if (isToday(selectedDate)) {
                        customerBooking = findCustomerBookingById(customerBookingId);
                    } else {
                        customerBooking = await getCustomerBooking(customerBookingBookingID);
                    }

                    if (bookedEmployee !== null && bookedEmployee.id !== employeeID) {
                        conflicted = true;
                        conflictEmployeeEvents[info.event.id] = "border-4 border-red-600";
                        info.el.className = `ec-event border-4 border-red-600`;
                    } else if (
                        bookedEmployee !== null &&
                        bookedEmployee.id === employeeID
                    ) {
                        info.el.className = `ec-event border-4 border-black`;
                        assignedEmployeeEvents[info.event.id] = "border-4 border-black";
                    }

                    // Submit the changes to the backend
                    if (customerBooking) {
                        // Get the individual and service booking instance from the customer booking
                        let serviceBooking = findServiceBookingFromCustomerBooking(
                            customerBooking,
                            serviceBookingID
                        );


                        if(serviceBooking && serviceBooking.assignedEmployee)
                        {
                            iconCombination+=employeeAssignedSVG;
                        }
                        else {
                            iconCombination+=employeeNotAssignedSVG;
                        }

                        highlight=serviceBooking.service.highlight;
                    }
                }

                info.el.className += ` ${isBlocked ? 'dottedBackground' : "individual-" + extendedProps.individualID} pop-out-no-border ${highlight?'glowing-border':''}`;

                const timeDiv = `<div class="text-sm font-semibold flex flex-row">${iconCombination}${extendedProps.time}</div>`;
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
            //if infinite hover bug appears again, might have to refer to old commits and bring bag the horrible fixes for it.
            if (info.event.title !== "") {
                let extendedProps = info.event.extendedProps;
                let isBlocked = extendedProps.description == "Blocked";
                if (!isBlocked) {
                    let bookingID = extendedProps.servicingTicket.bookingID;
                    let individualID = extendedProps.servicingTicket.individualID;
                    let highlight = extendedProps.servicingTicket.servicingTicketInfo.service.highlight;
                    info.el.className = `ec-event ${highlight?'glowing-border':''} pop-out-no-border individual-${individualID} border-4 border-green-500 border-dashed`;
                    highlightRelatedEvents(bookingID, individualID);
                } else {
                    info.el.className = `ec-event pop-out-no-border dottedBackground border-4 border-green-500 border-dashed`;
                }
            } else {
                // empty for now
            }
        },
        eventMouseLeave: function (info) {
            if (info.event.title !== "") {
                let extendedProps = info.event.extendedProps;
                let isBlocked = extendedProps.description == "Blocked";
                if (!isBlocked) {
                    let bookingID = info.event.extendedProps.servicingTicket.bookingID;
                    let individualID =
                        info.event.extendedProps.servicingTicket.individualID;
                    resetHighlight(bookingID, individualID);
                    let highlight = extendedProps.servicingTicket.servicingTicketInfo.service.highlight;

                    info.el.className = `ec-event ${highlight?'glowing-border':''} pop-out-no-border individual-${individualID} ${assignedEmployeeEvents[info.event.id] ? assignedEmployeeEvents[info.event.id] : ""} ${conflictEmployeeEvents[info.event.id] ? conflictEmployeeEvents[info.event.id] : ""}`;
                } else {
                    info.el.className = `ec-event pop-out-no-border dottedBackground`;
                }
            }
        },
        eventResize: function (info) {
            let startTime = dayjs(info.event.start);
            let endTime = dayjs(info.event.end);

            let totalDuration = endTime.diff(startTime, "minute");

            let extendedProps = info.event.extendedProps;
            let isBlocked = extendedProps.description == "Blocked";
            // console.log("isBlocked", isBlocked);

            // Only continue to process if it is not the past
            if (!isPast(selectedDate))
            {
                if (!isBlocked) {
                    let currTicketID = info.event.extendedProps.servicingTicket.ticketID;
                    let currServiceBookingID =
                        info.event.extendedProps.servicingTicket.serviceBookingID;

                    // Get the customer booking instance
                    let customerBookingId =
                        info.event.extendedProps.servicingTicket.servicingTicketInfo.id;
                    let customerBooking = findCustomerBookingById(customerBookingId);

                    // Allow edit of service booking duration
                    // The customer booking state is not completed
                    // Servicing ticket is not completed
                    if (
                        info.event.extendedProps.servicingTicket.servicingTicketInfo
                            .bookingState !== CustomerBookingState.COMPLETED ||
                        !info.event.extendedProps.servicingTicket.isCompleted
                    ) {
                        const allEvents = calendarInstance.getEvents();
                        allEvents.forEach((event) => {
                            if (
                                event.extendedProps.servicingTicket &&
                                event.extendedProps.servicingTicket.ticketID !== currTicketID &&
                                event.extendedProps.servicingTicket.serviceBookingID ===
                                currServiceBookingID
                            ) {
                                startTime = dayjs(event.start);
                                endTime = dayjs(event.end);
                                totalDuration += endTime.diff(startTime, "minute");
                            }
                        });

                        // Initialize the duration change for service booking
                        let serviceBooking = undefined;
                        if (customerBooking) {
                            serviceBooking = findServiceBookingFromCustomerBooking(
                                customerBooking,
                                currServiceBookingID
                            );

                            serviceBooking.servicingDuration = totalDuration;
                        }
                    }

                    // Submit the change to database
                    initializeCustomerBookingAndBroadcast(customerBooking, nowTime());
                } else {

                    let blockTicket = extendedProps.blockTicket;
                    blockTicket.duration = totalDuration;

                    // Submit the change to database
                    initializeEmployeeTimetableBlockTicket(
                        $business.businessInfo.businessID,
                        blockTicket
                    );
                }
            }
        },
        eventDragStart: function () {
            // console.log("eventDragStart, info", info);
            // info.event.backgroundColor="rgb(255,255,255)";

            const element = document.querySelectorAll(".ec-preview");

            element.forEach((element) => {
                element.style.backgroundColor = "rgb(255,255,255) !important";
            });
        },
        eventDragStop: function () {
        },
        eventDrop: async function (info) {

            // The employee and start time that the event was dragged to
            let assignedEmployeeID = null;
            let startTime = dayjs(info.event.start).format(formatToTime);

            let extendedProps = info.event.extendedProps;
            let isBlocked = extendedProps.description === "Blocked";

            console.log("eventDrop extendedProps", extendedProps);
            console.log("extendedProps.servicingTicket", extendedProps.servicingTicket);
            console.log("isBlocked", isBlocked);

            // Only continue to process if it is not the past
            if (!isPast(selectedDate))
            {
                // Servicing ticket
                if (!isBlocked) {
                    // Get the customer booking and service booking instances
                    const customerBookingId =
                        extendedProps.servicingTicket.servicingTicketInfo.id;
                    const customerBookingBookingID = extendedProps.servicingTicket.bookingID;
                    const individualID = extendedProps.individualID;
                    const serviceBookingID = extendedProps.servicingTicket.serviceBookingID;

                    // Get the customer booking instance
                    // If it is today, can get it from queue list from dashboard
                    // Otherwise has to fetch from the backend
                    let customerBooking = undefined;
                    if (isToday(selectedDate)) {
                        customerBooking = findCustomerBookingById(customerBookingId);
                    } else {
                        customerBooking = await getCustomerBooking(customerBookingBookingID);
                    }

                    // Submit the changes to the backend
                    if (customerBooking) {
                        // Get the individual and service booking instance from the customer booking
                        let individual = findIndividualBookingFromCustomerBooking(customerBooking, individualID);
                        let serviceBooking = findServiceBookingFromCustomerBooking(
                            customerBooking,
                            serviceBookingID
                        );

                        // Drag between employee timetable will set the assigned employee for the service booking
                        if (info.newResource && info.oldResource) {
                            // Assign employee working on the service
                            // Cannot assign when the booking state is completed
                            if (customerBooking.bookingState !== CustomerBookingState.COMPLETED) {
                                if (info.newResource.id !== "null") {
                                    assignedEmployeeID = parseInt(info.newResource.id, 10);
                                }
                            }
                        }
                        // Same employee timetable
                        // Need to handle this differently because there is no oldResource
                        else {
                            let employeeID = info.event.resourceIds[0];
                            if (employeeID !== "null") {
                                assignedEmployeeID = parseInt(employeeID, 10);
                            }
                        }

                        // Handling the drag and drop
                        // Do not make changes if the booking state is in COMPLETED
                        if (customerBooking.bookingState !== CustomerBookingState.COMPLETED) {
                            // Dragged to conflicted
                            // Reset the assigned employee and start time
                            if (assignedEmployeeID === null)
                            {
                                serviceBooking.assignedEmployee = null;

                                // Adjust the service booking servicing order
                                timetableSortServiceBookingList(individual, serviceBookingID, startTime);

                                // Reset the start time if booking state in APPOINTMENT or LOBBY
                                // Because ticket get automatically schedule
                                if (customerBooking.bookingState === CustomerBookingState.APPOINTMENT ||
                                    customerBooking.bookingState === CustomerBookingState.LOBBY)
                                {
                                    // If it is the selected is the first service booking, then reset all the start time
                                    if (individual.customerIndividualServiceBookingList[0].serviceBookingID === serviceBookingID)
                                    {
                                        // Initialize the rest of the start times to follow after the pin
                                        for (let i = 0; i < individual.customerIndividualServiceBookingList.length; i++) {
                                            individual.customerIndividualServiceBookingList[i].startTime = null;
                                        }
                                    }
                                    // Only reset the start time of the service booking
                                    else
                                    {
                                        serviceBooking.startTime = null;
                                    }
                                }
                            }
                            // Dragged to employee
                            else
                            {
                                // Only assign to employee if the timetable is allowed
                                if (ableToAssignEmployeeToServicingTicket)
                                {
                                    serviceBooking.assignedEmployee = getEmployee(assignedEmployeeID);
                                }

                                // If the first service booking is the selected service booking
                                // Ignore the order adjustment
                                // This is to make easier to adjust the servicing time up and down
                                if (individual.customerIndividualServiceBookingList[0].serviceBookingID !== serviceBookingID)
                                {
                                    timetableSortServiceBookingList(individual, serviceBookingID, startTime);
                                }

                                // Always set the start time if the customer booking is SERVICING
                                // This will allow the ticket to freely move in the timetable
                                if (customerBooking.bookingState === CustomerBookingState.SERVICING) {
                                    serviceBooking.startTime = startTime;
                                }
                                // Appointment and lobby
                                // Always set the start time for all service booking for automatic scheduling
                                else if (customerBooking.bookingState === CustomerBookingState.APPOINTMENT ||
                                    customerBooking.bookingState === CustomerBookingState.LOBBY) {

                                    // Pin the individual tickets to the new start time
                                    if (individual.customerIndividualServiceBookingList[0].serviceBookingID === serviceBookingID)
                                    {
                                        // Initialize the rest of the start times to follow after the pin
                                        for (let i = 0; i < individual.customerIndividualServiceBookingList.length; i++) {
                                            individual.customerIndividualServiceBookingList[i].startTime = startTime;
                                        }
                                    }
                                }
                            }
                        }

                        // Submit to the database
                        await initializeCustomerBookingAndBroadcast(customerBooking, nowTime()).finally(()=>{console.log("serviceBooking",serviceBooking);});
                    }
                }
                // Block ticket, employee reserve time period
                else {
                    // Drag to conflicted, delete the block ticket
                    if (info.newResource && info.newResource.id === "null") {
                        console.log("deleting block ticket");
                        let blockTicket = extendedProps.blockTicket;
                        await deleteEmployeeTimetableBlockTicket($business.businessInfo.businessID, blockTicket);
                    }
                    // Edit the block ticket
                    else {
                        // Change the employee
                        if (info.newResource && info.oldResource) {
                            // Assign employee working on the service
                            // Cannot assign when the booking state is completed
                            console.log("info.newResource", info.newResource);
                            assignedEmployeeID = parseInt(info.newResource.id, 10);
                        }
                        // Same employee timetable
                        else {
                            let employeeID = info.event.resourceIds[0];
                            if (employeeID !== "null") {
                                assignedEmployeeID = parseInt(employeeID, 10);
                            }
                        }

                        // Assign the employee to the service
                        let assignedEmployee = getEmployee(assignedEmployeeID);

                        // Initialize the block ticket
                        let blockTicket = extendedProps.blockTicket;
                        blockTicket.employee = assignedEmployee;
                        blockTicket.startTime = startTime;

                        // Submit to the database
                        await initializeEmployeeTimetableBlockTicket(
                            $business.businessInfo.businessID,
                            blockTicket
                        );
                    }
                }
            }
        },
    };

    function highlightRelatedEvents(bookingID, individualID) {
        const allEvents = calendarInstance.getEvents();
        allEvents.forEach((event) => {
            // Customer booking
            if (
                event.extendedProps.servicingTicket &&
                event.extendedProps.servicingTicket.bookingID === bookingID
            ) {
                event.backgroundColor = "#7d5821";
                calendarInstance.updateEvent(event);
            }
        });

        const elements = document.querySelectorAll(`.individual-${individualID}`);

        elements.forEach((element) => {
            element.className = `${element.className} border-4 border-green-500 border-dashed`;
        });
    }

    function resetHighlight(bookingID, individualID) {
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

        const elements = document.querySelectorAll(`.individual-${individualID}`);

        elements.forEach((element) => {
            element.className = element.className
                .replace(" border-green-500", "")
                .replace(" border-4", "")
                .replace(" border-dashed", "")
                .trim();
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

        const toolbar = document.querySelector(".ec-toolbar");

        if (toolbar) {
            toolbar.style.display = "none";
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

        const calendarContainer = document.getElementById("calendar"); // Adjust this ID to match your actual calendar container
        calendarContainer.addEventListener("click", function (event) {
            // Check if the clicked element or one of its parents has the class 'resource-label'
            const resourceLabel = event.target.closest(".resource-label");
            if (resourceLabel) {
                const resourceId = resourceLabel.id.replace("resource-label-", ""); // Extract ID
                clickedID = resourceId;
            }
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

    // Event parameters
    export let limitShowEvents = true;
    export let restrictedPast = true;

    // $: console.log(`Now time ${$now.format(formatToTime)}`);
    // $: console.log("$timetableComponent", $timetableComponent);

    onMount(async () => {
        await fetchTimetable(selectedDate);
    });

    // Employee user
    // Filter the timetable to only show the employee
    export let user = undefined;
    $: if (user && user.email && $timetableComponent.employeeTimetableList)
    {
        const specificEmployeeTimetable = findEmployeeTimetable(user);

        if (specificEmployeeTimetable) {
            timetableComponent.set({
                ...$timetableComponent,
                employeeTimetableList: [
                    {
                        ...specificEmployeeTimetable
                    }
                ]
            })
        }
    }

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

    let autoScroll = false;

    function searchBookings() {
        const normalizedSearchValue = normalizeSearchInput(searchValue);

        if (searchValue.length === 0) {
            // Re-scroll to the current time
            if (autoScroll) {
                autoScroll = false;
                options.scrollTime = $now.format("HH:mm:ss");
            }

            filteredEmployeeTimetableList = $timetableComponent.employeeTimetableList;
            showSearchText = "";
        } else {
            // Keep track of autoscroll for later when the search box is empty
            autoScroll = true;

            filteredEmployeeTimetableList = $timetableComponent.employeeTimetableList
                .map((employeeTimetable) => {
                    return {
                        ...employeeTimetable,
                        servicingTicketList: employeeTimetable.servicingTicketList.filter(
                            (ticket) =>
                                normalizeSearchInput(
                                    ticket.servicingTicketInfo.phoneNumber
                                ).includes(normalizedSearchValue) ||
                                normalizeSearchInput(
                                    ticket.servicingTicketInfo.customerName
                                ).includes(normalizedSearchValue) ||
                                normalizeSearchInput(
                                    shortCustomerBookingID(ticket.servicingTicketInfo.id)
                                ).includes(normalizedSearchValue)
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

    // Clicked employee for employee timetable modal
    export let showPastEmployeeWorkScheduleModal = false;
    export let ableToChangeEmployeeWorkSchedule = true;
    let clickedID = undefined;
    // Clicked employee for employee timetable modal
    // Not the past
    // Open the schedule exception modal
    $: if (clickedID && (showPastEmployeeWorkScheduleModal || !isPast(selectedDate))) {
        console.log("Timetable employee clickedID", clickedID);

        // Get the clicked employee
        const clickedEmployee = findEmployeeFromBusinessUsingEmployeeID($business, clickedID);

        // Open the employee timetable modal
        (async () => {
            await handleOpenEmployeeTimetableModal(clickedEmployee, selectedDate).finally(() => {
                clickedID = undefined;
            });
        })();

    }

    async function updateCalendarEvents(employeeTimetableList) {
        // loading = true;

        await handleTimetableUpdateForServicingTicketClickModal(
            employeeTimetableList
        ).then(() => {
            //console.log("handleTimetableUpdateForServicingTicketClickModal() completed.");
        });

        // Generate the events for display
        employeeWorkHourEvent = [];
        // console.log("employeeTimetableList", employeeTimetableList);
        employeeEvents = await createEvents(employeeTimetableList);

        resources = employeeTimetableList.flatMap((employeeTable) => {
            employeeWorkHourEvent.push({
                resourceId: employeeTable.employee.id,
                color:
                    employeeTable.employee.id === -1 || !employeeTable.employee.id
                        ? "red"
                        : "#FFF9D0",
                start: `${dayjs().format("YYYY-MM-DD")} ${employeeTable.timePeriod.startTime}`,
                end: `${dayjs().format("YYYY-MM-DD")} ${employeeTable.timePeriod.endTime}`,
                display: "background",
            });
            let countOfNullResourceIds = employeeEvents.filter(
                (event) => event.resourceId === null
            ).length;

            return {
                id: employeeTable.employee.id,
                title: {
                    html: employeeTable.employee.id
                        ? `<span class="flex flex-row items-center justify-center w-full">               <svg class="w-6 h-6 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                   <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
               </svg>
               ${employeeTable.employee.employeeName}
             </span>`
                        : `<span class="flex flex-row items-center justify-center ${countOfNullResourceIds > 0 ? "animate-pulse" : ""}">
               <svg class="w-5 h-5 text-red-400 dark:text-white"  fill="currentColor" width="24" height="24"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                   <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7H514.3c3.9 0 7.6-.7 11-2.1l-261-205.6z"/>
               </svg>
               ${employeeTable.employee.employeeName} - ${countOfNullResourceIds}
             </span>`,
                },
            };
        });

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

    function getDisplayBookingIDList(employeeTimetableList) {
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

        // Events for block tickets
        const blockEvents = employeeTimetableList.flatMap((employeeTable) =>
            employeeTable.blockTicketList.map((blockTicket) => {
                // console.log("blockTicket", blockTicket);

                return {
                    start: `${dayjs().format("YYYY-MM-DD")} ${blockTicket.startTime}`,
                    end: `${dayjs().format("YYYY-MM-DD")} ${getEndTime(blockTicket.startTime, blockTicket.duration)}`,
                    resourceId: employeeTable.employee.id,
                    title: ` `,
                    color: "grey", // Using grey to denote blocked times

                    extendedProps: {
                        employeeTimetable: employeeTable,
                        time: `${formatTimeAm(blockTicket.startTime)} - ${formatTimeAm(getEndTime(blockTicket.startTime, blockTicket.duration))}`,
                        blockTicket: blockTicket,
                        description: `Blocked`,
                    },
                };
            })
        );

        // Events for servicing ticket
        const servicingEvents = employeeTimetableList.flatMap((employeeTable) =>
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
                        start: `${dayjs().format("YYYY-MM-DD")} ${servicingTicket.timePeriod.startTime}`,
                        end: `${dayjs().format("YYYY-MM-DD")} ${servicingTicket.timePeriod.endTime}`,
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
                            individualID: servicingTicket.individualID,
                        },
                    };
                })
        );

        // Return
        return [...blockEvents, ...servicingEvents];
    }

    function selectToday() {
        selectedDate = today();
    }

    function selectTomorrow() {
        selectedDate = dayjs(selectedDate).add(1, "day").format(formatToDate);
    }

    function selectYesterday() {
        selectedDate = dayjs(selectedDate).subtract(1, "day").format(formatToDate);
    }
</script>

<div
        class="relative flex flex-col items-center justify-center sm:w-5/6 w-11/12 h-auto mx-auto my-2 overflow-x-auto space-y-1"
>
    <div
            class="flex sm:flex-row flex-col left-0 inline-block h-fit sm:space-y-0 space-y-1 items-center justify-evenly w-full"
    >
        <div class="flex flex-row sm:justify-normal justify-center items-center">
            <Button
                    class="h-fit text-md mr-1"
                    size="xs"
                    color="light"
                    on:click={() => {
          selectToday();
        }}
                    disabled={isToday(selectedDate)}
            >Today
            </Button>
            <div class="flex items-center">
                <Button
                        class="rounded-r-none h-fit"
                        size="xs"
                        color="light"
                        on:click={() => {
            selectYesterday();
          }}
                >
                    <ChevronLeftOutline class="w-6 h-6"/>
                </Button>
                <input
                        class="border-gray-300 w-[8rem]"
                        bind:value={selectedDate}
                        type="date"
                />
                <Button
                        class="rounded-l-none h-fit"
                        size="xs"
                        color="light"
                        on:click={() => {
            selectTomorrow();
          }}
                >
                    <ChevronRightOutline class="w-6 h-6"/>
                </Button>
            </div>
        </div>

        <div
                class="flex flex-row sm:justify-normal justify-center items-center m-0"
        >
            <form
                    class="flex flex-row max-w-xs justify-center items-center"
                    on:submit={searchBookings}
            >
                <Search
                        bind:value={searchValue}
                        size="md"
                        class="rounded-none rounded-l-lg py-2.5"
                        placeholder="Search Booking Info"
                        maxlength="20"
                ></Search>
                <Button type="submit" class="!p-2.5 rounded-none">
                    <SearchOutline class="w-5 h-5"/>
                </Button>
                <Button
                        color="blue"
                        class="!p-2.5 rounded-s-none"
                        on:click={handleNewCustomerBookingLobbyModalForLobby}
                >
                    <PlusOutline class="w-5 h-5"/>
                </Button>
            </form>
        </div>
    </div>
    <div class="flex flex-col">
        <strong class="sm:my-0 mt-1 text-sm">{showSearchText}</strong>
    </div>

    <div
            class="flex flex-col items-center justify-center w-full max-w-fit h-full mx-auto mb-2 overflow-x-auto overflow-visible border-2 border-gray-300 rounded"
    >
        <div id="calendar" class="flex h-full mx-auto max-w-[4/5]">
            <div class="relative w-full h-full max-h-[calc(100%-40px)] mx-auto">
                <div class="absolute top-0 left-0 ml-8">
                    <InfoCircleSolid
                            size="lg"
                            id="b1"
                            class="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1"
                    />
                    <Popover
                            title="TimeTable ToolTip"
                            placement="bottom-end"
                            triggeredBy="#b1"
                            class="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 z-[1050]"
                    >

                        <div class="flex-col justify-start">
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
                        
                        <DropdownDivider/>

                        <div class="flex-col justify-start">

                            <div class="flex items-center">
                                <div class="flex-col bg-gray-500 bg-opacity-10 rounded-lg items-center">
                                <svg class="w-6 h-6 text-gray-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
                                </svg>
                                <svg class="w-5 h-5 text-red-400 dark:text-white"  fill="currentColor" width="24" height="24"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7H514.3c3.9 0 7.6-.7 11-2.1l-261-205.6z"/>
                                </svg>
                                </div>
                                <span class="text-sm">Select to edit employee timetable for specific date</span>
                            </div>
                        </div>
                    </Popover>
                </div>
            </div>
            <Calendar bind:this={calendarInstance} {plugins} {options}/>
        </div>
    </div>
</div>

<!--Modal for servicing ticket-->
<ServicingTicketClickModal isToday={isToday(selectedDate)}/>

<!--Modal for edit employee timetable work hour and block ticket-->
<EmployeeTimetableModal
        bind:selectedDate={selectedDate}
        {ableToChangeEmployeeWorkSchedule}
/>


<style>
    :global(.ec-event-time) {
        display: none;
    }

    :global(.timeDivClass) {
        color: white;
    }

    :global(.ec-now-indicator) {
        z-index: 1049;
    }

    :global(.dottedBackground) {
        --dot-bg: #5d5d5d;
        --dot-color: white;
        --dot-size: 2px;
        --dot-space: 22px;
        background: linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
        linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
        var(--dot-color);
    }

    :global(.hoverable) {
        border: 2px solid transparent;
        background-color: white;
        transition: transform 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
        transform-origin: center; /* Ensures scaling happens from the center */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Optional: adds a slight shadow for depth */
    }

    :global(.hoverable:hover) {
        transform: scale(1.05); /* Scales up the element by 5% */
        border-left-width: 5px;
        border-right-width: 5px;
        border-color: #4075a6;
        background-color: #f0f0f0;
    }

    :global(.hoverable:active) {
        border-color: orange;
        border-left-width: 5px;
        border-right-width: 5px;
        background-color: #e0e0e0;
    }

    :global(.pop-out-no-border) {
        transition: transform 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
        transform-origin: center; /* Ensures scaling happens from the center */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Optional: adds a slight shadow for depth */
    }

    :global(.pop-out-no-border:hover) {
        transform: scale(1.05); /* Scales up the element by 5% */
        z-index: 10!important;
    }

    :global(.pop-out-no-border:active) {
        background-color: #e0e0e0;
    }

    :global(.tooltip-container) {
        position: relative;
        display: block;
    }

    :global(.tooltip) {
        visibility: hidden;
        background-color: #4f4d4d;
        width: auto; /* Adjust width dynamically */
        max-width: 200px; /* Maximum width to prevent excessively long tooltips */
        color: white;
        text-align: center;
        border-radius: 6px;
        padding: 5px 10px; /* Added horizontal padding */
        position: absolute;
        z-index: 2000;
        top: 100%; /* Position below the icon */
        left: 50%;
        transform: translateX(-50%);
        margin-top: 5px; /* Space between icon and tooltip */
        font-size: 11px; /* Smaller text size */
        opacity: 0;
        transition: opacity 0.3s;
        white-space: nowrap; /* Prevent text from wrapping */
        overflow: hidden; /* Hide text that overflows the max-width */
        text-overflow: ellipsis; /* Add ellipsis if text overflows */
    }


    :global(.tooltip-container:hover .tooltip) {
        visibility: visible;
        opacity: 1;
    }

    :global(.glowing-border) {
        box-shadow: inset 0 0 20px #000000;
    }

    /*:global(.ec-preview) {*/
    /*  background-color: rgba(255, 0, 0, 0.34) !important;*/
    /*}*/
</style>
