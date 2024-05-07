<script>
    import {onMount, setContext} from "svelte";
    import {getSchedule, initializeCustomerBooking} from "$lib/api/api_server/lobby-portal/api.js";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import Calendar from '@event-calendar/core';
    import ResourceTimeGrid from '@event-calendar/resource-time-grid';
    import {Modal} from "flowbite-svelte";
    import {getCustomerBooking} from "$lib/api/api_server/customer-booking-portal/api.js";
    import dayjs from "dayjs";
    import CustomerIndividualServiceBooking
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/CustomerIndividualBooking/CustomerIndividualServiceBooking/CustomerIndividualServiceBooking.svelte";
    import {
        findIndividualBookingByID,
        findServiceBookingByID
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/customer-booking-utility-functions.js";
    import {moveToCompleted} from "$lib/api/api_server/lobby-portal/utility-functions/handle_customer_booking_state.js";

    let plugins = [ResourceTimeGrid];

    function scrollToNowIndicator() {
        const nowIndicator = document.querySelector('.ec-now-indicator');
        if (nowIndicator) {
            nowIndicator.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }

    function findECBody() {
        const element = document.querySelector('.ec-body');

        if (element) {
            element.style.overflowX = 'hidden';
            element.style.overflowY = 'auto';
            element.style.scrollbarWidth = 'auto';
            element.style.scrollbarColor = 'white ';
        }

        const resourceElements = document.querySelectorAll('.ec-resource');

        resourceElements.forEach(element => {
            element.style.minWidth = "200px";
        });

        const overflowElements = document.querySelectorAll('.ec.ec-time-grid.ec-resource-day-view');

        scrollToNowIndicator();
    }

    let openModal = false;
    let eventInfo = undefined;
    let customerBooking = undefined;
    let individualBooking = undefined;
    let serviceBooking = undefined;

    async function openModalServicingTicket(info)
    {
        console.log("eventInfo", info)

        eventInfo = info;
        customerBooking = await getCustomerBooking(eventInfo.event.extendedProps.servicingTicket.bookingID);
        individualBooking = findIndividualBookingByID(customerBooking, eventInfo.event.extendedProps.servicingTicket.individualID);
        serviceBooking = findServiceBookingByID(individualBooking, eventInfo.event.extendedProps.servicingTicket.serviceBookingID)

        // Open the servicing ticket modal
        openModal = true;
    }

    let options = {
        view: 'resourceTimeGridDay',

        allDaySlot: false,
        nowIndicator: true,
        dayMaxEvents: true,
        slotDuration: '00:05:00',
        scrollTime: $now.format('HH:mm:ss'),
        headerToolbar: {
            start: '',
            center: '',
            end: ''
        },
        resources: [],
        events: [],
        eventClick: function (info) {
            openModalServicingTicket(info);
        },
        eventAllUpdated: function () {
            findECBody();
        }
    };

    let events = [];
    let resources = [];
    let loading = true;

    async function createEvents(employeeTimetableList) {
        return employeeTimetableList.flatMap(employeeTable =>
            employeeTable.servicingTicketList.map(servicingTicket => {
                const title = servicingTicket.service.serviceName;

                // Servicing ticket colour
                let servicingTicketColor = "#3399ff"; // Light blue, appointment state
                if (servicingTicket.bookingState === 1)
                {
                    servicingTicketColor = "#FFC300";
                }
                else if (servicingTicket.bookingState === 2)
                {
                    servicingTicketColor = "#90ee90";

                    // In the case of servicing ticket is completed
                    if (servicingTicket.completed)
                    {
                        servicingTicketColor = "gray";
                    }
                }
                else if (servicingTicket.bookingState === 3)
                {
                    servicingTicketColor = "gray";
                }

                return {
                    // Event variables
                    start: `${$now.format('YYYY-MM-DD')} ${servicingTicket.timePeriod.startTime}`,
                    end: `${$now.format('YYYY-MM-DD')} ${servicingTicket.timePeriod.endTime}`,
                    resourceId: employeeTable.employee.id,
                    title: title,

                    // Ticket state
                    color: servicingTicketColor,

                    // Booking information
                    extendedProps: {
                        employeeTimetable: employeeTable,
                        servicingTicket: servicingTicket
                    }
                };
            })
        );
    }

    async function fetchSchedule()
    {
        loading = true;

        try {
            const response = await getSchedule($businessInfo.business.businessId, $now.format(formatToDate), $now.format(formatToTime));
            const {employeeTimetableList} = response;

            console.log("employeeTimetableList", employeeTimetableList)

            events = await createEvents(employeeTimetableList);

            resources = employeeTimetableList.flatMap(employeeTable => ({
                id: employeeTable.employee.id, title: `${employeeTable.employee.employeeName}`
            }));

            options.resources = resources;
            options.events = events;

            if (options.events.length === 0)
            {
                setTimeout(function() { findECBody(); }, 50);
            }
        } catch (error) {
            console.error('Failed to  fetch tasks', error);
            events = [];
            resources = [];
        }

        loading = false;
    }

    onMount(async () => {
        await fetchSchedule();
    });

    // Automatic fetch for the latest customer booking list
    setInterval(async () => fetchSchedule(), 30000);

    async function submitCustomerBooking(customerBooking)
    {
        // Submit the change to the server
        await initializeCustomerBooking(customerBooking);

        // Update the schedule
        await fetchSchedule();
    }

    setContext('submitCustomerBooking', submitCustomerBooking);

    async function handleCompleteClick()
    {
        console.log('Moving to completed:', customerBooking);

        await moveToCompleted($now, customerBooking, submitCustomerBooking);
    }
</script>

<div class="flex flex-col items-center justify-center p-1.5">
    Today - {$now.format("MMM D, YYYY")}
    <button
            class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            on:click={fetchSchedule}
            disabled={loading}
    >
        Refresh
    </button>
</div>

{#if !loading}

    <!-- Legend for color coding -->
    <div class="legend flex justify-around items-center w-full p-4 bg-white shadow rounded-lg mb-4">
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

    <div class="flex flex-col items-center justify-center w-4/5 h-4/5 mx-auto overflow-x-auto">
        <div class="flex h-full m-auto"
        >
            <Calendar {plugins} {options}/>
        </div>
    </div>
{/if}

<div class="absolute top-0 left-0 right-0" style="z-index: 1006;">
    <Modal bind:open={openModal} size="md" autoclose outsideclose>
        <div>
            <p><strong>Customer name:</strong> {customerBooking.customer.customerName}</p>
            <p><strong>Booking time:</strong> {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAM)}</p>
            <p><strong>Number of guest(s):</strong> {customerBooking.customerIndividualBookingList.length}</p>
            <p class="break-words"><strong>Message:</strong> {customerBooking.message}</p>

            <div class="mt-1 p-1">
                <div class="font-bold">Service:</div>

                {#if customerBooking.bookingState !== 3}
                    <CustomerIndividualServiceBooking
                            {customerBooking}
                            {individualBooking}
                            {serviceBooking}
                    />

                    <div class="mt-4 flex justify-end items-center space-x-2">
                        <span class="text-gray-700 font-bold">Move to:</span>
                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" on:click={handleCompleteClick}>Complete</button>
                    </div>
                {:else}
                    <p>{serviceBooking.service.serviceName}</p>
                {/if}
            </div>
        </div>
    </Modal>
</div>
