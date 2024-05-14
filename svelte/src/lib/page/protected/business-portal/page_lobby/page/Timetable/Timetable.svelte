<script>
    import {onMount} from "svelte";
    import {getSchedule} from "$lib/api/api_server/lobby-portal/api.js";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime} from "$lib/application/Formatter.js";
    import TimeTable from "$lib/page/protected/business-portal/components/TimeTable/TimeTable.svelte";

    let events=[];
    let employeeEvents = [];
    let employeeWorkHourEvent = [];
    let resources = [];
    let loading = true;

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

    async function fetchSchedule(isToday, selectedDate) {
        console.log("FEtching schedule");
        loading = true;

        try {
            // Get the current time based on if it is today
            let currentTimeString = "00:00";
            if (isToday) {
                currentTimeString = $now.format(formatToTime);
            }

            const response = await getSchedule(
                $businessInfo.business.businessId,
                selectedDate,
                currentTimeString
            );
            const {employeeTimetableList} = response;

            console.log("business employeeTimetableList", employeeTimetableList);

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

            console.log("resources ",resources);
            console.log("employeeWorkHourEvent",employeeWorkHourEvent);

            employeeEvents = await createEvents(employeeTimetableList);
            events = [...employeeWorkHourEvent,...employeeEvents];

            // if (events.length === 0) {
            //     setTimeout(function () {
            //         findECBody();
            //     }, 50);
            // }
        } catch (error) {
            console.error("Failed to  fetch tasks", error);
            employeeEvents = [];
            resources = [];
            employeeWorkHourEvent = [];
            events=[];
        }

        loading = false;
        console.log("DONE");
    }

    onMount(async () => {
        try {
            await fetchSchedule(true, $now.format(formatToDate));
        } catch (err) {
            console.error("Failed to fetch schedule", err);
        }
    });

</script>

{#if !loading}
<TimeTable
    bind:resources={resources}
    bind:events={events}
    bind:loading={loading}
    fetchSchedule={fetchSchedule}
/>
{/if}