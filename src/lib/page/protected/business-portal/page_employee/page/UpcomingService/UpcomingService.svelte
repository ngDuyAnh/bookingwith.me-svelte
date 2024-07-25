<script>
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime} from "$lib/application/Formatter.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        servicingTicketClickModal,
        servicingTicketClickModalOpen,
        servicingTicketClickModalSetEmployeeTimetableList, servicingTicketClickModalToggleOpen,
    } from "$lib/components/Modal/ServicingTicketClickModal/stores/servicingTicketClickModal.js";
    import {getCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {
        findServiceBookingFromCustomerBooking
    } from "$lib/api/utilitiy_functions/CustomerBooking.js";
    import {onDestroy, onMount} from "svelte";
    import {
        getEmployeeSchedule
    } from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/MyTimeTable.js";
    import {Button, Spinner} from "flowbite-svelte";
    import {
        ArrowLeftOutline,
        ArrowRightOutline,
        InfoCircleSolid,
    } from "flowbite-svelte-icons";
    import ServicingTicketClickModal
        from "$lib/components/Modal/ServicingTicketClickModal/ServicingTicketClickModal.svelte";

    let loading = false;
    let employeeTimetableList = undefined;

    async function fetchSchedule() {
        currentIndex = 0;
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
            if (
                $servicingTicketClickModal.open &&
                $servicingTicketClickModal.customerBooking
            ) {
                // Fetch the recent changes to the customer booking
                const fetchCustomerBooking = await getCustomerBooking(
                    $servicingTicketClickModal.customerBooking.bookingID
                );

                if (fetchCustomerBooking) {
                    // Get the latest service booking from the customer booking
                    let fetchServiceBooking = findServiceBookingFromCustomerBooking(
                        fetchCustomerBooking,
                        $servicingTicketClickModal.serviceBooking.serviceBookingID
                    );

                    servicingTicketClickModalOpen(
                        fetchCustomerBooking,
                        fetchServiceBooking
                    );
                } else {
                    console.log(
                        "Customer booking not found for customer booking click modal."
                    );
                }
            }
        } catch (error) {
            console.error("Failed to  fetch tasks", error);
        }

        console.log("????", employeeTimetableList[0].servicingTicketList);
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

    onDestroy(() => {
        servicingTicketClickModalToggleOpen();
    });

    let validActiveTickets = [];
    let validUpcomingTicket = [];
    let currentIndex = 0;
    let currentTicket;
    let option = 0;

    async function checkAndOpenModalForServicingTickets(employeeTimetableList) {
        if (
            employeeTimetableList.length > 0 &&
            employeeTimetableList[0].servicingTicketList.length > 0
        ) {
            const servicingTickets = employeeTimetableList[0].servicingTicketList;

            validActiveTickets = servicingTickets.filter(
                (ticket) => !ticket.isCompleted && ticket.isOngoing
            );
            let upcomingTicket = servicingTickets.find(
                (ticket) => !ticket.isCompleted && !ticket.isOngoing
            );
            validUpcomingTicket = [];
            if (upcomingTicket) {
                validUpcomingTicket = [upcomingTicket];
            }

            await updateCurrentTicket();
        }
    }

    let loadingTicket = false;

    async function updateCurrentTicket() {
        loadingTicket = true;
        const tickets = option === 0 ? validActiveTickets : validUpcomingTicket;
        console.log("tickets", tickets);
        currentTicket = tickets[currentIndex] || null;
        if (currentTicket) {
            await openModalServicingTicket(currentTicket).finally(() => {
                loadingTicket = false;
            });
        }
    }

    async function nextTicket() {
        const tickets = option === 0 ? validActiveTickets : validUpcomingTicket;
        if (currentIndex < tickets.length - 1) {
            currentIndex++;
            await updateCurrentTicket();
        }
    }

    async function previousTicket() {
        if (currentIndex > 0) {
            currentIndex--;
            await updateCurrentTicket();
        }
    }

    $: if (option === 0 || option === 1) {
        currentIndex = 0;
        (async () => {
            await updateCurrentTicket();
        })();

        // console.log("validActiveTickets.length",validActiveTickets.length);
        // console.log("validUpcomingTickets.length",validUpcomingTickets.length);
        //
        // console.log(currentIndex >= ((option === 0 ? validActiveTickets.length : validUpcomingTickets.length) - 1));
    }

    async function openModalServicingTicket(servicingTicket) {
        // Get the customer booking and service booking associated with the servicing ticket
        let customerBooking = await getCustomerBooking(servicingTicket.bookingID);
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
    <div class="flex flex-col items-center space-y-1 mt-2 h-full">
        <div class="flex flex-row justify-center space-x-1 z-[2]">
            <Button
                    color={option == 0 ? "blue" : "alternative"}
                    on:click={() => (option = 0)}>Currently Servicing
            </Button
            >
            <Button
                    color={option == 1 ? "blue" : "alternative"}
                    on:click={() => (option = 1)}>Upcoming
            </Button
            >
            <Button color="alternative" on:click={fetchSchedule}>Refresh</Button>
        </div>
        <div class="flex flex-col justify-center items-center h-full w-fit">
            {#if option == 0 || option == 1}
                {#if currentTicket}
                    {#key currentTicket}
                        <div
                                class="animate-fade-in flex flex-col basis-3/4 relative h-fit justify-center items-center overflow-x-auto rounded-lg my-2 border-2"
                        >
                            <ServicingTicketClickModal isToday={true} nonModal={true}/>
                        </div>
                    {/key}

                    <div class="basis-1/4 z-[2]">
                        <div class="flex space-x-3 rtl:space-x-reverse">
                            {#if option == 0}
                                <Button
                                        pill={true}
                                        class="flex items-center"
                                        disabled={currentIndex === 0 || loadingTicket}
                                        on:click={previousTicket}
                                >
                                    <ArrowLeftOutline size="md"/>
                                </Button>
                                <Button
                                        pill={true}
                                        class="flex items-center"
                                        disabled={loadingTicket ||
                    currentIndex >=
                      (option === 0
                        ? validActiveTickets.length
                        : validUpcomingTicket.length) -
                        1}
                                        on:click={nextTicket}
                                >
                                    <ArrowRightOutline size="md"/>
                                </Button>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <div
                            class="flex flex-col justify-center items-center w-full !h-full text-base md:text-xl p-4"
                    >
                        <div class="flex flex-row justify-center items-center space-x-2">
                            <InfoCircleSolid class="w-5 h-5 ripple" slot="icon"/>
                            {#if option == 0}
                                <span>You have not started any services yet.</span>
                            {:else if option == 1}
                                <span>No Upcoming Service Found For Today</span>
                            {/if}
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
{/if}
