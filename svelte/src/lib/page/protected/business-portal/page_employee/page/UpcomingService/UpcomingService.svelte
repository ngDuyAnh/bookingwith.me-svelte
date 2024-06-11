<script>
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime} from "$lib/application/Formatter.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        servicingTicketClickModal,
        servicingTicketClickModalOpen,
        servicingTicketClickModalSetEmployeeTimetableList
    } from "$lib/components/TimeTable/TimetableModal/stores/servicingTicketClickModal.js";
    import {getCustomerBooking} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {
        findServiceBookingFromCustomerBooking
    } from "$lib/api/initialize_functions/customer-booking-utility-functions.js";
    import {onMount} from "svelte";
    import {
        getEmployeeSchedule
    } from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/MyTimeTable.js";
    import {Spinner} from "flowbite-svelte";
    import dayjs from "dayjs";
    import ServicingTicketClickModal from "$lib/components/TimeTable/TimetableModal/ServicingTicketClickModal.svelte";
    import {InfoCircleSolid} from "flowbite-svelte-icons";

    let loading = false;
    let employeeTimetableList = undefined;
    let foundService = false;

    async function fetchSchedule() {
        loading = true;

        try {
            // Get the current time based on if it is today
            let currentTimeString = "00:00";
            currentTimeString = $now.format(formatToTime);
            let selectedDate = $now.format(formatToDate);

            employeeTimetableList = await getEmployeeSchedule(
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

            // // Generate the events for display
            // employeeWorkHourEvent = [];
            // resources = employeeTimetableList.flatMap((employeeTable) => {
            //     employeeWorkHourEvent.push({
            //         resourceId: employeeTable.employee.id,
            //         color: employeeTable.employee.id === -1 || !employeeTable.employee.id ? "red" : "#FFF9D0",
            //         start: `${$now.format("YYYY-MM-DD")} ${employeeTable.timePeriod.startTime}`,
            //         end: `${$now.format("YYYY-MM-DD")} ${employeeTable.timePeriod.endTime}`,
            //         display: "background",
            //     });
            //     return {
            //         id: employeeTable.employee.id,
            //         title: `${employeeTable.employee.employeeName}`,
            //     };
            // });
            //
            // employeeEvents = await createEvents(employeeTimetableList);
            //
            // options.resources = resources;
            // options.events = employeeWorkHourEvent.concat(employeeEvents);
            //
            // if (options.events.length === 0) {
            //     setTimeout(function () {
            //         findECBody();
            //     }, 50);
            // }
        } catch (error) {
            console.error("Failed to  fetch tasks", error);
            // employeeEvents = [];
            // resources = [];
            // employeeWorkHourEvent = [];
        }

        console.log("????", employeeTimetableList[0].servicingTicketList)
        await checkAndOpenModalForServicingTickets(employeeTimetableList);

        loading = false;
    }

    onMount(async () => {
        try {
            await fetchSchedule();
        } catch (err) {
            console.error("Failed to fetch schedule", err);
        }
    });

    async function checkAndOpenModalForServicingTickets(employeeTimetableList) {
        const currentTime = $now;  // Get the current time from the store

        if (employeeTimetableList.length > 0 && employeeTimetableList[0].servicingTicketList.length > 0) {
            const servicingTickets = employeeTimetableList[0].servicingTicketList;

            const validTicket = servicingTickets.find(ticket => {
                const ticketStartTime = dayjs(ticket.timePeriod.startTime, "HH:mm");
                return !ticket.isCompleted &&
                    !ticket.isOngoing &&
                    ticketStartTime.isAfter(currentTime);
            });

            if (validTicket) {
                foundService = true;
                await openModalServicingTicket(validTicket);
            } else {
                console.log("No valid servicing ticket found.");
            }
        }
    }

    async function openModalServicingTicket(servicingTicket) {
        // Get the customer booking and service booking associated with the servicing ticket
        let customerBooking = await getCustomerBooking(
            servicingTicket.bookingID
        );
        let serviceBooking = findServiceBookingFromCustomerBooking(
            customerBooking,
            servicingTicket.serviceBookingID
        );

        // Pre-select the employee with the employee timetable that it is currently with
        //preselectEmployeeID = eventInfo.event.extendedProps.employeeTimetable.employee.id;

        // Open the servicing ticket modal
        servicingTicketClickModalOpen(customerBooking, serviceBooking);
    }

</script>

{#if loading}
    <div class="flex flex-col justify-center items-center w-full h-full">
        <Spinner/>
    </div>
{:else}

    {#if foundService}
        <div class="flex flex-col justify-center items-center w-full h-full">
            <ServicingTicketClickModal
                    isToday={true}
                    nonModal={true}
            />
        </div>
    {:else}
        <div class="flex flex-col justify-center items-center w-full h-full text-base md:text-xl p-4">
            <div class="flex flex-row justify-center items-center space-x-2">
                <InfoCircleSolid class="w-5 h-5 ripple" slot="icon"/>
                <span>No Upcoming Service Found For Today</span>
            </div>
        </div>

    {/if}
{/if}