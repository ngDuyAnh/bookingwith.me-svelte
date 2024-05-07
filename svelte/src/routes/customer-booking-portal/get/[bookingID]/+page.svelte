<script>
    import dayjs from 'dayjs';
    import {onMount} from "svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getCustomerBookingEstimate} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {formatToTime} from "$lib/application/Formatter.js";
    import {Spinner} from "flowbite-svelte";

    export let data;

    let today = $now.format('ddd, MMM D YYYY');
    let isToday = false;

    let customerBooking = undefined;
    let queuePosition = -1;
    let servicingTimePeriod = undefined;

    let bookingDateFormatted = "";
    let bookingTime = "";

    async function fetchCustomerEstimate()
    {
        // Get the estimate
        // Assume it is today
        const response = await getCustomerBookingEstimate(data.bookingID, $now.format(formatToTime));

        console.log("customerBooking", response)

        // Extract the response
        customerBooking = response.customerBooking;
        queuePosition = response.queuePosition;
        servicingTimePeriod = response.servicingTimePeriod;

        // Display information
        let bookingDate = dayjs(customerBooking.bookingDate);
        isToday = bookingDate.isSame($now, 'day');
        bookingDateFormatted = bookingDate.format('ddd, MMM D YYYY');

        bookingTime = customerBooking.bookingTime;
    }

    onMount(async () => {
        await fetchCustomerEstimate();
    });

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
    <div class="flex flex-col h-screen bg-white text-gray-900">

        <div class="flex justify-between items-center p-6 shadow-md">
            <h1 class="text-3xl font-bold">
                Welcome {customerBooking.customer.customerName},
            </h1>
            <h2 class="text-3xl font-light">
                {today}
            </h2>
        </div>

        <div class="flex-grow flex flex-col justify-center items-center text-xl p-8">
            <p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
                Your appointment is on
                <span class="underline">{bookingDateFormatted}</span> at
                <span class="underline">{bookingTime}</span>.
            </p>

            {#if isToday}
                <div class="mt-4 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                    Your position in the queue is {queuePosition}
                </div>
                <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                    Estimate start servicing time is {servicingTimePeriod.startTime}
                </div>
            {:else}
                Check this link on your appointment day for real-time updates!
            {/if}
        </div>

</div>
{/if}
