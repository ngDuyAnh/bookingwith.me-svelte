<script>
    import dayjs from "dayjs";
    import {employeeSelectOptions} from "$lib/page/stores/employeeSelectOptions/employeeSelectOptions.js";
    import {Button, Select} from "flowbite-svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {ServicingTicket} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {moveToServicing} from "$lib/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {BusinessScheduleManagement, Employee} from "$lib/api/initialize_functions/Business.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {initializeCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";

    export let customerBooking;
    export let serviceBooking;

    export let preselectEmployeeID = undefined;

    let selectedEmployeeID = null;
    if (preselectEmployeeID !== undefined) {
        selectedEmployeeID = preselectEmployeeID;
    }

    async function handleStartServicing()
    {
        // Create the servicing ticket
        let servicingTicket = {
            ...ServicingTicket(),

            employee: {
                ...Employee(),
                id: selectedEmployeeID
            },

            timePeriod: {
                startTime: $now.format(formatToTime),
                endTime: null
            },
        }

        // Add the servicing ticket to the service booking
        serviceBooking.servicingTicketList.push(servicingTicket);

        console.log('Start servicing:', serviceBooking, selectedEmployeeID);

        // Service the customer booking
        moveToServicing($now, customerBooking);

        // Reset the selected employee after starting servicing
        selectedEmployeeID = null;
    }

    function handleEndServicing(servicingTicket) {
        // Initialize the end time
        servicingTicket.timePeriod.endTime = $now.format(formatToTime);

        console.log('End servicing:', servicingTicket);

        // Save the customer booking change
        initializeCustomerBooking(customerBooking);
    }

    function handleServiceBookingCompletedToggle() {
        // Set the service booking completed toggle
        serviceBooking.completed = !serviceBooking.completed;

        // End all ongoing servicing ticket associated to the service booking
        if (serviceBooking.completed) {
            serviceBooking.servicingTicketList.forEach(ticket => {
                if (!ticket.isCompleted) {
                    ticket.timePeriod.endTime = $now.format(formatToTime);
                }
            });
        }

        //console.log('Service booking completed:', serviceBooking);

        // Save the customer booking change
        initializeCustomerBooking(customerBooking);
    }
</script>

<div>
    <!-- Display the service booking -->
    <p>{serviceBooking.service.serviceName} ({serviceBooking.employee?.employeeName || 'Any employee'})</p>

    <!-- Form to manage service booking -->
    {#if $business.businessInfo.scheduleManagement === BusinessScheduleManagement.ACTIVE}
        <div class="flex flex-row items-center space-x-4 p-1.5"
             style="{serviceBooking.completed ? 'border-radius: 0.5rem; background: repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)' : ''}">
            <!-- Form to add new servicing ticket -->
            <form class="flex flex-row flex-grow items-center space-x-4 {serviceBooking.completed? 'cursor-not-allowed':''}" on:submit|preventDefault>
                <Select
                        items={$employeeSelectOptions}
                        bind:value={selectedEmployeeID}
                        class="flex-1 disabled:cursor-not-allowed"
                        disabled={serviceBooking.completed}
                        required
                />
                <Button
                        type="submit"
                        on:click={handleStartServicing}
                        disabled={!selectedEmployeeID || serviceBooking.completed}
                        class="{serviceBooking.completed? 'bg-gray-900 hover:bg-gray-900 disabled':''}"
                >
                    Start
                </Button>
            </form>

            <!-- Service booking completed status -->
            <Button
                    on:click={handleServiceBookingCompletedToggle}
                    class={`px-4 py-2 text-white font-bold rounded ${!serviceBooking.completed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
                {!serviceBooking.completed ? 'Mark service as done' : 'Mark service as not done'}
            </Button>
        </div>

        <!-- Existing servicing ticket -->
        <!-- Only display ticket that is not completed -->
        {#each serviceBooking.servicingTicketList.filter(ticket => !ticket.isCompleted) as ticket}
            <div class="mt-4 p-4 border border-gray-500 rounded bg-gray-100">
                <div class="p-2">
                    <p><strong>Employee:</strong> {ticket.employee.employeeName}</p>
                    <p><strong>Start
                        Time:</strong> {dayjs(ticket.timePeriod.startTime, formatToTime).format(formatToTimeAm)}</p>
                    <Button on:click={() => handleEndServicing(ticket)} disabled={ticket.isCompleted}>
                        End
                    </Button>
                </div>
            </div>
        {/each}
    {/if}
</div>
