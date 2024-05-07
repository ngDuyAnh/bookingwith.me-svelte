<script>
    import {
        businessInfo,
        pageIndex,
        customerBooking
    } from "$lib/page/customer-booking-portal/create/stores/customer_booking_portal_store.js";
    import NumGuestSelect from "$lib/page/customer-booking-portal/create/page/NumGuessSelect/NumGuestSelect.svelte";
    import CustomerIndividualBooking
        from "$lib/page/customer-booking-portal/create/page/CustomerIndividualBooking/CustomerIndividualBooking.svelte";
    import CustomerBookingInformation
        from "$lib/page/customer-booking-portal/create/page/CustomerBookingInformation/CustomerBookingInformation.svelte";
    import BookingSuccess from "$lib/page/customer-booking-portal/create/page/BookingSuccess/BookingSuccess.svelte";
    import {
        employeeSelectOptions,
        employeeToSelectOption
    } from "$lib/page/stores/EmployeeSelectOptions/employeeSelectOptions_store.js";
    import {onMount} from "svelte";
    import {getBusiness} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {goto} from "$app/navigation";
    import {CustomerBooking} from "$lib/api/api_server/customer-booking-portal/initialize_functions.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";

    export let data;

    onMount(async () => {
        try {
            // Get the business information
            let business = await getBusiness(data.businessId);

            // Check if the business is not found or not active
            if (!business || !business.active) {
                console.error('Business not found or not active');
                await goto('/error'); // Redirect to the error page
            }

            businessInfo.set(business);

            // Convert the employee list to selectable options
            if ($businessInfo.employeeList && Array.isArray($businessInfo.employeeList)) {
                employeeSelectOptions.set($businessInfo.employeeList.map(employeeToSelectOption));
            }

            // Initialize the customer booking
            customerBooking.set(CustomerBooking($now));
        } catch (e) {
            console.error('Failed to fetch business information:', e);
            await goto('/error');
        }
    });
</script>

<div class="min-h-screen w-full">
    {#if $pageIndex === 0}
        <NumGuestSelect/>
    {:else if $pageIndex === 1}
        <CustomerIndividualBooking/>
    {:else if $pageIndex === 2}
        <CustomerBookingInformation/>
    {:else if $pageIndex === 3}
        <BookingSuccess/>
    {/if}
</div>
