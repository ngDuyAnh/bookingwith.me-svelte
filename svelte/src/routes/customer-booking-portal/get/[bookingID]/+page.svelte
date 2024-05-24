<script>
    import dayjs from 'dayjs';
    import {onMount} from "svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getCustomerBookingEstimate} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Spinner} from "flowbite-svelte";
    import report_icon from "$lib/images/report_icon/message-report.png";
    import Today from "$lib/page/customer-booking-portal/get/page/Today/Today.svelte";
    import Future from "$lib/page/customer-booking-portal/get/page/Future/Future.svelte";
    import Past from "$lib/page/customer-booking-portal/get/page/Past/Past.svelte";
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";

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

    let loading = true;

    onMount(async () => {
        await fetchCustomerBookingEstimate();

        console.log("bookingEstimate", $bookingEstimate);

        loading = false;
    });

    // Automatic fetch
    setInterval(async () => fetchCustomerBookingEstimate(), 10000);

</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner />
    </div>
{:else}
    <div class="flex flex-col text-gray-900">

        <div class="bg-white shadow-md flex justify-between items-center p-4 md:p-6 relative">
            <h2 class="text-lg md:text-xl lg:text-2xl font-light text-gray-800 flex-grow">
                Today: {$now.format('ddd, MMM D YYYY')}
            </h2>

            <div class="absolute top-3 right-3 md:top-4 md:right-4">
                <a href="/report" class="block hover:scale-110 transition-transform duration-300">
                    <img src={report_icon}
                         alt="Kid's helpline"
                         title="Kid's helpline"
                         class="w-8 h-8" />
                </a>
            </div>
        </div>

        {#if relativeDate === 0}
            <Today/>
        {:else if relativeDate > 0}
            <Future/>
        {:else if relativeDate < 0}
            <Past/>
        {/if}
    </div>
{/if}
