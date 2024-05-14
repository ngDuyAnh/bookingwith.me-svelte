<script>
    import Calendar from '@event-calendar/core';
    import ResourceTimeGrid from '@event-calendar/resource-time-grid';
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getBusiness, getBusinessInformation, getEmployeeWorkSchedule} from "$lib/api/api_server/business-portal/api.js";
    import {getSchedule} from "$lib/api/api_server/lobby-portal/api.js";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import {formatToDate, formatToTime} from "$lib/application/Formatter.js";
    import { onMount } from 'svelte';


    let plugins = [ResourceTimeGrid];

    console.log("Here")

    let options = {
        view: 'resourceTimeGridDay',

        allDaySlot: false,
        nowIndicator: true,
        dayMaxEvents: true,
        slotDuration: '00:30:00',
        scrollTime: $now.format('HH:mm:ss'),
        headerToolbar: {
            start: '',
            center: '',
            end: ''
        },
        resources: [],
        events: [],
        eventClick: function () {
            // openModalServicingTicket(info);
        },
        eventAllUpdated: function () {
            findECBody();
        }
    };

    let events = [];
    let resources;
    let employeeWorkHourEvent;
    let employeeEvents;
    let loading = true;



    let isToday = true;

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
            element.style.minWidth = "15vw";
        });

        const todayElements = document.querySelectorAll(".ec-day.ec-today");

        todayElements.forEach((element) => {
            element.style.background = "rgba(0,0,0,0.1)";
        });
    }

    onMount(() => {
        fetchData();
    });

    async function fetchData() {
        const selectedDate = $now.format(formatToDate);
        const currentTimeString = isToday ? $now.format(formatToTime) : "00:00";

        console.log("now", $now);

        const response = await getBusiness("ek63l-t7rfo-1cbmj-4mnck");
        console.log(response);

        const businfo = await getBusinessInformation("ek63l-t7rfo-1cbmj-4mnck");
        console.log(businfo);

        if (businfo && businfo.employeeList && businfo.employeeList.length > 0) {
            const employee = await getEmployeeWorkSchedule(businfo.employeeList[0].id);
            console.log(employee);
        }

        console.log("businessInfo",$businessInfo);
        const res = await getSchedule(
            "ek63l-t7rfo-1cbmj-4mnck",
            selectedDate,
            currentTimeString
        );
        const { employeeTimetableList } = res;
        console.log(employeeTimetableList);

        processTimetables(employeeTimetableList);

        employeeEvents = await createEvents(employeeTimetableList);

        options.resources = resources;
        options.events = employeeWorkHourEvent.concat(employeeEvents);

        if (options.events.length === 0) {
            setTimeout(function () {
                findECBody();
            }, 50);
        }
    }

    function processTimetables(employeeTimetableList) {
        resources = [];
        employeeWorkHourEvent =[];
        employeeTimetableList.forEach((employeeTable) => {
            if (employeeTable.employee.id === 8) { // Filter for employee ID 9
                // Adding event for the specific employee
                employeeWorkHourEvent.push({
                    resourceId: employeeTable.employee.id,
                    color: employeeTable.employee.id === -1 ? "red" : "#FFF9D0",
                    start: `${$now.format("YYYY-MM-DD")} ${employeeTable.timePeriod.startTime}`,
                    end: `${$now.format("YYYY-MM-DD")} ${employeeTable.timePeriod.endTime}`,
                    display: "background",
                });
                // Adding resource for the specific employee
                resources.push({
                    id: employeeTable.employee.id,
                    title: `${employeeTable.employee.employeeName}`,
                });
            }
        });
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
                    title: `${servicingTicket.service.serviceName}\n${servicingTicket.servicingTicketInfo.customerName}`,

                    // Ticket state
                    color: servicingTicketColor,

                    // Booking information
                    extendedProps: {
                        employeeTimetable: employeeTable,
                        servicingTicket: servicingTicket,
                    },
                };
            })
        );
    }

    function bookingStateColour(servicingTicket) {
        let servicingTicketColor = "#3399ff"; // Light blue, appointment state
        if (servicingTicket.bookingState === 1) {
            servicingTicketColor = "#FFC300";
        } else if (servicingTicket.bookingState === 2) {
            // In servicing queue waiting to be service
            servicingTicketColor = "#90ee90";

            // In the case of servicing ticket is completed
            if (servicingTicket.completed) {
                servicingTicketColor = "gray";
            }
            // The ticket is currently being service
            else if (servicingTicket.ticketId !== -1) {
                servicingTicketColor = "#29c029";
            }
        } else if (servicingTicket.bookingState === 3) {
            servicingTicketColor = "gray";
        }

        return servicingTicketColor;
    }
</script>

<div class="w-[100vw] h-[100vh]">
    <div class="flex flex-col items-center justify-center p-1.5">
<!--        <div class="flex items-center justify-center p-1.5">-->
<!--            <input-->
<!--                    bind:value={selectedDate}-->
<!--                    min={$now.format(formatToDate)}-->
<!--                    type="date"-->
<!--            />-->
<!--            <button-->
<!--                    class="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"-->
<!--                    disabled={loading}-->
<!--                    on:click={fetchSchedule}-->
<!--            >-->
<!--                Refresh-->
<!--            </button>-->
<!--        </div>-->

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


<div class="flex flex-col items-center justify-center w-4/5 h-4/5 mx-auto overflow-x-auto">
<!--    <div class="flex h-full m-auto">-->
<!--        <Calendar {plugins} {options}/>-->
<!--    </div>-->
</div>

</div>