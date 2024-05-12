<script>
    import {
        employeeSelectOptions
    } from "$lib/page/stores/EmployeeSelectOptions/employeeSelectOptions_store.js";
    import {Button, Select} from "flowbite-svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {getContext} from "svelte";
    import {
        CustomerBookingState
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions.js";
    import {moveToServicing} from "$lib/api/api_server/lobby-portal/utility-functions/handle_customer_booking_state.js";
    import dayjs from "dayjs";

    export let customerBooking;
    export let individualBooking;
    export let serviceBooking;

    export let preselectEmployee = undefined;

    let selectedEmployee = null;
    if (preselectEmployee !== undefined)
    {
        selectedEmployee = preselectEmployee;
    }

    // Retrieve customer booking list update function
    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleStartServicing() {
        console.log('Start servicing:', serviceBooking, selectedEmployee);

        // If the customer is not in servicing queue, move them there
        customerBooking.bookingState = CustomerBookingState.SERVICING;

        // Create the servicing ticket
        let servicingTicket = {
            bookingID: customerBooking.bookingID,
            individualID: individualBooking.individualID,
            serviceBookingID: serviceBooking.serviceBookingID,
            ticketId: -1,
            employee: {
                id: selectedEmployee,
                employeeName: "",
                archive: false
            },
            timePeriod: {
                startTime: $now.format(formatToTime),
                endTime: null
            },
            completed: false
        };

        // Add the servicing ticket to the service booking
        serviceBooking.servicingTicketList.push(servicingTicket);

        // Service the customer booking
        await moveToServicing($now, customerBooking, submitCustomerBooking);

        // Reset the selected employee after starting servicing
        selectedEmployee = null;
    }

    function handleEndServicing(servicingTicket)
    {
        console.log('End servicing:', servicingTicket);

        // Initialize the end time
        servicingTicket.timePeriod.endTime = $now.format(formatToTime);

        // Save the customer booking change
        submitCustomerBooking(customerBooking);
    }

    function handleServiceBookingCompletedToggle()
    {
        console.log('Service booking completed:', serviceBooking);

        // Set the service booking completed toggle
        serviceBooking.completed = !serviceBooking.completed;

        // End all ongoing servicing ticket associated to the service booking
        if (serviceBooking.completed) {
            serviceBooking.servicingTicketList.forEach(ticket => {
                if (!ticket.completed) {
                    ticket.completed = true;
                    ticket.timePeriod.endTime = $now.format(formatToTime);
                }
            });
        }

        // Save the customer booking change
        submitCustomerBooking(customerBooking);
    }
</script>

<div>
    <!-- Display the service booking -->
    <p>{serviceBooking.service.serviceName} ({serviceBooking.employee?.employeeName || 'Any'})</p>

    <!-- Form to manage service booking -->
    <div class="flex flex-row items-center space-x-4">
        <!-- Form to add new servicing ticket -->
        <form class="flex flex-row flex-grow items-center space-x-4" on:submit|preventDefault>
            <Select
                    items={$employeeSelectOptions}
                    bind:value={selectedEmployee} class="flex-1"
                    disabled={serviceBooking.completed}
                    required
            />
            <Button
                    type="submit"
                    on:click={handleStartServicing}
                    disabled={!selectedEmployee || serviceBooking.completed}
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
    {#each serviceBooking.servicingTicketList.filter(ticket => !ticket.completed) as ticket}
        <div class="mt-4 p-4 border border-gray-500 rounded bg-gray-100">
            <div class="p-2">
                <p><strong>Employee:</strong> {ticket.employee.employeeName}</p>
                <p><strong>Start Time:</strong> {dayjs(ticket.timePeriod.startTime, formatToTime).format(formatToTimeAm)}</p>
                <Button on:click={() => handleEndServicing(ticket)} disabled={ticket.completed}>
                    End
                </Button>
            </div>
        </div>
    {/each}
</div>
