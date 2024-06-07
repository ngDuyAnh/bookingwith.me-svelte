<script>
    import {employeeSelectOptions} from "$lib/page/stores/employeeSelectOptions/employeeSelectOptions.js";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/functions.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {Spinner} from "flowbite-svelte";
    import CustomerBookingComponent from "$lib/components/CustomerBooking/CustomerBookingComponent.svelte";
    import {CustomerBookingChannel} from "$lib/api/initialize_functions/CustomerBooking.js";

    export let data;
    let loading = true;

    // Business
    business.set(data.business);

    // Convert the employee list to selectable options
    if ($business && $business.employeeList && Array.isArray($business.employeeList))
    {
        employeeSelectOptions.set($business.employeeList.map(employeeToSelectOption));
    }

    loading = false;
</script>

<div class="h-screen w-screen">
    {#if loading}
        <div class="flex justify-center items-center h-screen">
            <Spinner />
        </div>
    {:else}
        <CustomerBookingComponent
                bookingChannel={CustomerBookingChannel.ONLINE}

                business={$business}
        />
    {/if}
</div>
