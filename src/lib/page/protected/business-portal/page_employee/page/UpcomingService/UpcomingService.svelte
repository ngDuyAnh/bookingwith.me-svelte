<script>
    import {
        servicingTicketClickModalOpen, servicingTicketClickModalSetEmployeeTimetableList,
        servicingTicketClickModalToggleOpen
    } from "$lib/components/Modal/ServicingTicketClickModal/stores/servicingTicketClickModal.js";
    import {getCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {
        findServiceBookingFromCustomerBooking
    } from "$lib/api/utilitiy_functions/CustomerBooking.js";
    import {Button} from "flowbite-svelte";
    import {
        ArrowLeftOutline,
        ArrowRightOutline,
        InfoCircleSolid,
    } from "flowbite-svelte-icons";
    import ServicingTicketClickModal
        from "$lib/components/Modal/ServicingTicketClickModal/ServicingTicketClickModal.svelte";
    import {
        timetableComponent,
        findEmployeeTimetable
    } from "$lib/components/Timetable/stores/timetableComponent.js";
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";
    import {onDestroy} from "svelte";

    let validActiveTickets = [];
    let validUpcomingTicket = [];
    let currentIndex = 0;
    let currentTicket;
    let option = 0;

    $: console.log(`validActiveTickets ${validActiveTickets.length} validUpcomingTicket ${validUpcomingTicket.length}`)

    onDestroy(() => {
        servicingTicketClickModalToggleOpen();
    });

    $: if ($timetableComponent.employeeTimetableList) {
        console.log("Here")

        // Setup for the servicing ticket modal
        servicingTicketClickModalSetEmployeeTimetableList($timetableComponent.employeeTimetableList);

        // Open the modal showing the upcoming customer booking
        checkAndOpenModalForServicingTickets();
    }

    async function checkAndOpenModalForServicingTickets() {

        // Get the employee timetable
        const employeeTimetable = findEmployeeTimetable($userProfile.user)

        console.log("employeeTimetable", employeeTimetable);

        // Open the servicing ticket modal
        if (employeeTimetable)
        {
            console.log("employeeTimetable", employeeTimetable)

            const servicingTickets = employeeTimetable.servicingTicketList;

            validActiveTickets = servicingTickets.filter(
                (ticket) => !ticket.isCompleted && ticket.isOngoing
            );
            validUpcomingTicket = servicingTickets.filter(
                (ticket) => !ticket.isCompleted && !ticket.isOngoing
            );

            console.log("validActiveTickets", validActiveTickets);
            console.log("validUpcomingTicket", validUpcomingTicket);

            await updateCurrentTicket();
        }
    }

    let loadingTicket = false;

    async function updateCurrentTicket() {
        loadingTicket = true;
        const tickets = (option === 0) ? validActiveTickets : validUpcomingTicket;

        console.log(`tickets currentIndex ${currentIndex}`, tickets);

        currentTicket = tickets[currentIndex] || null;

        console.log("currentTicket", currentTicket);

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

<div class="flex flex-col items-center space-y-1 mt-2 h-full">
    <div class="flex flex-row justify-center space-x-1 z-[2]">
        <Button
                color={option === 0 ? "blue" : "alternative"}
                on:click={() => (option = 0)}>Currently Servicing
        </Button
        >
        <Button
                color={option === 1 ? "blue" : "alternative"}
                on:click={() => (option = 1)}>Upcoming
        </Button
        >
    </div>
    <div class="flex flex-col justify-center items-center h-full w-fit">
        {#if option === 0 || option === 1}
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
                        {#if option === 0}
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
                        {#if option === 0}
                            <span>You have not started any services yet.</span>
                        {:else if option === 1}
                            <span>No upcoming service found.</span>
                        {/if}
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>
