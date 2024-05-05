<script>
    import {onMount} from "svelte";
    import {getSchedule} from "$lib/api_server/lobby-portal/api.js";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import {now} from "$lib/page/protected/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime} from "$lib/application/Formatter.js";
    import Calendar from '@event-calendar/core';
    import ResourceTimeGrid from '@event-calendar/resource-time-grid';
    import {getCustomerBooking} from "$lib/api_server/customer-booking-portal/api.js";
    import EmployeeCard from "$lib/page/protected/business-portal/page_lobby/page/Timetable/EmployeeCard.svelte";

    let open = false;
    let eventInfo = {};
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
            element.style.minWidth = "100px";
        });


        const overflowElements = document.querySelectorAll('.ec.ec-time-grid.ec-resource-day-view');

        overflowElements.forEach(element => {
            element.style.overflowX = "scroll";
        });


        scrollToNowIndicator();
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
            open = true;
            eventInfo = info;
        },
        eventAllUpdated: function () {
            findECBody();
        }


    };


    let events = [];
    let resources = [];
    let scheduleDone = false;


    onMount(async () => {

        async function getServiceName(bookingID, individualID, serviceBookingID) {
            let name = "";
            try {
                const rep2 = await getCustomerBooking(bookingID);


                let customerIndividualBookingList = rep2.customerIndividualBookingList;

                for (let i = 0; i < customerIndividualBookingList.length; i++) {
                    let serviceBookingList = customerIndividualBookingList[i].customerIndividualServiceBookingList;
                    for (let j = 0; j < serviceBookingList.length; j++) {
                        let serviceBooking = serviceBookingList[j];
                        if (serviceBooking.bookingID == bookingID &&
                            serviceBooking.individualID == individualID &&
                            serviceBooking.serviceBookingID == serviceBookingID) {
                            name = serviceBooking.service.serviceName;
                            break;
                        }
                        if (name !== "")
                            break;
                    }
                }


            } catch (error) {
                console.error('Failed to  booking info', error);
            }

            return name || "No service name found";
        }

        async function createEvents(employeeTimetableList) {
            const promises = employeeTimetableList.flatMap(employeeTable =>
                employeeTable.serviceBookingList.map(async (booking) => {
                    const title = await getServiceName(booking.bookingID, booking.individualID, booking.serviceBookingID);

                    return {
                        start: `${$now.format('YYYY-MM-DD')} ${booking.timePeriod.startTime}`,
                        end: `${$now.format('YYYY-MM-DD')} ${booking.timePeriod.endTime}`,
                        resourceId: employeeTable.employee.id,
                        title: title,
                    };
                })
            );

            // Wait for all promises to resolve
            const events = await Promise.all(promises);
            return events;
        }

        try {
            const response = await getSchedule($businessInfo.business.businessId, $now.format(formatToDate), $now.format(formatToTime));
            const {employeeTimetableList} = response;

            events = await createEvents(employeeTimetableList);

            resources = employeeTimetableList.flatMap(employeeTable => ({
                id: employeeTable.employee.id, title: `${employeeTable.employee.employeeName}`
            }));

            options.resources = resources;
            options.events = events;

            if (options.events.length == 0)
            {
                setTimeout(function() { findECBody(); }, 50);

            }

            scheduleDone = true;


        } catch (error) {
            console.error('Failed to  fetch tasks', error);
            events = [];
            resources = [];
            scheduleDone = false;
        }
    });

</script>

<div class="flex flex-col items-center justify-center p-1.5">
    Today - {$now.format("MMM D, YYYY")}
</div>

{#if scheduleDone}
    <div class="flex flex-col items-center justify-center w-4/5 h-4/5 mx-auto overflow-x-auto">
        <div class="flex h-full m-auto"
        >
            <Calendar {plugins} {options}/>
        </div>
    </div>

{/if}

<EmployeeCard
        bind:open={open}
        eventInfo={eventInfo}
/>
