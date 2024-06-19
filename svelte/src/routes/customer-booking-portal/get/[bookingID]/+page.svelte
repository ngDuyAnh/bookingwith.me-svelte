<script>
    import dayjs from 'dayjs';
    import {onMount, setContext} from "svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {
        getCustomerBookingEstimate,
        initializeCustomerBooking
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Spinner} from "flowbite-svelte";
    import Today from "$lib/page/customer-booking-portal/get/page/Today/Today.svelte";
    import Future from "$lib/page/customer-booking-portal/get/page/Future/Future.svelte";
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import Deleted from "$lib/page/customer-booking-portal/get/page/Deleted/Deleted.svelte";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/functions.js";
    import {employeeSelectOptions} from "$lib/page/stores/employeeSelectOptions/employeeSelectOptions.js";
    import ModalEditCustomerBooking from "$lib/components/Modal/EditCustomerBooking/ModalEditCustomerBooking.svelte";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import Past from "$lib/page/customer-booking-portal/get/page/Past/Past.svelte";
    import NoShow from "$lib/page/customer-booking-portal/get/page/NoShow/NoShow.svelte";

    export let data;

    let relativeDate = 0;
    async function fetchCustomerBookingEstimate() {
        // Get the estimate
        // Assume it is today
        try
        {
            const response = await getCustomerBookingEstimate(data.bookingID, $now.format(formatToTime));

            // Extract the response
            let customerBooking = response.customerBooking;

            // Display information
            let bookingDate = dayjs(customerBooking.bookingDate).startOf("day");
            relativeDate = bookingDate.diff($now.startOf("day"), "day");

            // Appointment date and time format for display
            let bookingDateFormatted = bookingDate.format('ddd, MMM D YYYY');
            let bookingTimeFormatted = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

            // Estimate servicing time
            let servicingTimePeriod = response.servicingTimePeriod;
            let estimateServicingStartTime = dayjs(servicingTimePeriod.startTime, formatToTime).format(formatToTimeAm);
            let estimateServicingEndTime = dayjs(servicingTimePeriod.endTime, formatToTime).format(formatToTimeAm);

            // Set the information to the store
            bookingEstimate.set({
                ...response,
                relativeDate,
                bookingDateFormatted,
                bookingTimeFormatted,
                estimateServicingStartTime,
                estimateServicingEndTime
            });
        }
        catch (error)
        {
            console.log(error)
        }
    }

    setContext('fetchCustomerBookingEstimate', fetchCustomerBookingEstimate);

    let loading = true;

    onMount(async () => {
        await fetchCustomerBookingEstimate();

        // Convert the employee list to selectable options
        business.set($bookingEstimate.business);
        if ($business && $business.employeeList && Array.isArray($business.employeeList))
        {
            employeeSelectOptions.set($business.employeeList.map(employeeToSelectOption));
        }

        // SMS confirmation
        if (!$bookingEstimate.customerBooking.smsConfirmation)
        {
            $bookingEstimate.customerBooking.smsConfirmation = true;

            initializeCustomerBooking($bookingEstimate.customerBooking)
                .then(customerBooking => {
                    // Update the booking estimate store with the new data
                    bookingEstimate.update(current => ({
                        ...current,
                        customerBooking: customerBooking
                    }));
                    console.log('SMS confirmation initialized and saved to database.');
                })
                .catch(error => {
                    console.error('Error initializing SMS confirmation:', error);
                });
        }

        loading = false;
    });

    // Automatic fetch
    setInterval(async () => fetchCustomerBookingEstimate(), 60000);

    //$: console.log("bookingEstimate", $bookingEstimate);
</script>

<div class="h-dvh w-screen">
    {#if loading}
        <div class="flex justify-center items-center h-full w-full">
            <Spinner />
        </div>
    {:else}
        <div class="flex flex-col text-gray-900 h-full w-full">
            {#if $bookingEstimate.customerBooking.deleted}
                <Deleted/>
            {:else if $bookingEstimate.customerBooking.noShow}
                <NoShow/>
            {:else if relativeDate > 0}
                <Future/>
            {:else if relativeDate === 0 ||
                    $bookingEstimate.customerBooking.bookingState === CustomerBookingState.COMPLETED}
                <Today/>
            {:else}
                <Past/>
            {/if}
        </div>

        <!-- Modal for edit customer booking -->
        <ModalEditCustomerBooking
                business={$bookingEstimate.business}
        />
    {/if}
</div>
