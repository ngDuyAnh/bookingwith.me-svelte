<script>
    import {onMount} from "svelte";
    import {getSchedule} from "$lib/api/api_server/lobby-portal/api.js";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime} from "$lib/application/Formatter.js";
    import Calendar from '@event-calendar/core';
    import ResourceTimeGrid from '@event-calendar/resource-time-grid';
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
            element.style.minWidth = "200px";
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

        function createEvents(employeeTimetableList) {
            return employeeTimetableList.flatMap(employeeTable =>
                employeeTable.servicingTicketList.map(servicingTicket => {
                    const title = servicingTicket.service.serviceName;

                    return {
                        start: `${$now.format('YYYY-MM-DD')} ${servicingTicket.timePeriod.startTime}`,
                        end: `${$now.format('YYYY-MM-DD')} ${servicingTicket.timePeriod.endTime}`,
                        resourceId: employeeTable.employee.id,
                        title: title,
                    };
                })
            );
        }

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
