<script>
    import dayjs from 'dayjs';
    import {onMount} from "svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getCustomerBookingEstimate} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Spinner} from "flowbite-svelte";
    import report_icon from "$lib/images/report_icon/message-report.png";

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
        try
        {
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
        catch (error)
        {
            console.log(error)
        }
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

        <div class="flex-grow flex flex-col justify-center items-center text-xl p-8">
            <!-- Appointment is today -->
            {#if relativeDate === 0}
                <p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
                    Your appointment is
                    <span class="underline">today</span>!
                </p>

                <!-- Appointment and lobby -->
                {#if customerBooking.bookingState === 0 || customerBooking.bookingState === 1}
                    <div class="mt-4 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                        Your position in the queue is {queuePosition}
                    </div>
                    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                        Estimate start servicing time is from {estimateServicingStartTime} to {estimateServicingEndTime}
                    </div>
                    <div class="mt-2 bg-red-100 text-green-800 rounded-lg p-4 shadow">
                        Please arrive earlier than estimated to ensure smooth service. We apologize for any timing errors as our app is still in testing; your feedback is welcome at the top right corner.
                    </div>

                <!-- Servicing -->
                {:else if customerBooking.bookingState === 2}
                    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                        Estimate servicing end time is {estimateServicingEndTime}
                    </div>

                <!-- Completed -->
                {:else}
                    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                        Completed!
                    </div>
                {/if}

            <!-- Appointment is in the future -->
            {:else if relativeDate > 0}
                <p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
                    Your appointment is on
                    <span class="underline">{bookingDateFormatted}</span> at
                    <span class="underline">{bookingTimeFormatted}</span>.
                </p>

                <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                    Please check this link on your appointment day for real-time updates!
                </div>

            <!-- Appointment is in the past -->
            {:else}
                <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
                    Under construction!
                </div>

                We (me, myself, and I) are still working on features after the appointment is done.
            {/if}
        </div>

</div>
{/if}
