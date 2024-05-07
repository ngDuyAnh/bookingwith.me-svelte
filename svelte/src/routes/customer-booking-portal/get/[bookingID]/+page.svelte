<script>
    import dayjs from 'dayjs';
    import {onMount} from "svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getCustomerBookingEstimate} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Spinner} from "flowbite-svelte";

    export let data;

    let customerBooking = undefined;
    let queuePosition = -1;
    let servicingTimePeriod = undefined;

    let relativeDate = 0;
    let bookingDateFormatted = "";
    let bookingTimeFormatted = "";

    let estimateServicingStartTime = "";
    let estimateServicingEndTime = "";

    async function fetchCustomerEstimate() {
        // Get the estimate
        // Assume it is today
        const response = await getCustomerBookingEstimate(data.bookingID, $now.format(formatToTime));

        // Extract the response
        customerBooking = response.customerBooking;
        queuePosition = response.queuePosition;
        servicingTimePeriod = response.servicingTimePeriod;

        // Display information
        let bookingDate = dayjs(customerBooking.bookingDate).startOf("day");
        relativeDate = bookingDate.diff($now.startOf("day"), "day");

        // Appointment date and time format for display
        bookingDateFormatted = bookingDate.format('ddd, MMM D YYYY');
        bookingTimeFormatted = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

        // Estimate servicing time
        estimateServicingStartTime = dayjs(servicingTimePeriod.startTime, formatToTime).format(formatToTimeAm);
        estimateServicingEndTime = dayjs(servicingTimePeriod.endTime, formatToTime).format(formatToTimeAm);
    }

    onMount(async () => {
        await fetchCustomerEstimate();
    });

    // Automatic fetch
    setInterval(async () => fetchCustomerEstimate(), 10000);

    let loading = true;
    $: if (customerBooking)
    {
        loading = false;
    }
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner />
    </div>
{:else}
    <div class="flex flex-col text-gray-900">

        <div class="flex justify-between items-center p-6 shadow-md">
            <h1 class="text-3xl font-bold">
                Welcome!
            </h1>
            <h2 class="text-3xl font-light">
                {$now.format('ddd, MMM D YYYY')}
            </h2>
        </div>

        <div class="flex-grow flex flex-col justify-center items-center text-xl p-8">
            <p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
                Your appointment is on
                <span class="underline">{bookingDateFormatted}</span> at
                <span class="underline">{bookingTimeFormatted}</span>.
            </p>

            {#if relativeDate === 0}
                {#if customerBooking.bookingState === 0 || customerBooking.bookingState === 1}
                    <div class="mt-4 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                        Your position in the queue is {queuePosition}
                    </div>
                    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                        Estimate start servicing time is from {estimateServicingStartTime} to {estimateServicingEndTime}
                    </div>
                {:else if customerBooking.bookingState === 2}
                    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                        Estimate servicing end time is {estimateServicingEndTime}
                    </div>
                {:else}
                    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                        Completed!
                    </div>
                {/if}
            {:else if relativeDate > 0}
                <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                    Please check this link on your appointment day for real-time updates!
                </div>
            {:else}
                <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                    Under construction!
                </div>

                We (me, myself, and I) are still working on features after the appointment is done.
            {/if}
        </div>

</div>
{/if}
