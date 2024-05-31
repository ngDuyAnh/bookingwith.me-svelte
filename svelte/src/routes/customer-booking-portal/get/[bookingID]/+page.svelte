<script>
    import dayjs from 'dayjs';
    import {onMount, setContext} from "svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getCustomerBookingEstimate} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Spinner} from "flowbite-svelte";
    import Today from "$lib/page/customer-booking-portal/get/page/Today/Today.svelte";
    import Future from "$lib/page/customer-booking-portal/get/page/Future/Future.svelte";
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import Deleted from "$lib/page/customer-booking-portal/get/page/Deleted/Deleted.svelte";

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
        loading = false;
    });

    // Automatic fetch
    setInterval(async () => fetchCustomerBookingEstimate(), 60000);

    //console.log("bookingEstimate", $bookingEstimate);
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner />
    </div>
{:else}
    <div class="flex flex-col text-gray-900">
        {#if $bookingEstimate.customerBooking.deleted}
            <Deleted/>
        {:else if relativeDate > 0}
            <Future/>
        {:else if relativeDate <= 0}
            <Today/>
        {/if}
    </div>
{/if}
