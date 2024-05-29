<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import report_icon from "$lib/images/report_icon/message-report.png";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import dayjs from "dayjs";
    // import {isTomorrow} from "dayjs/plugin/isTomorrow";
    //
    // $now.extends(isTomorrow);
    let isTomorrow = false;
    $: isTomorrow = dayjs($bookingEstimate.customerBooking.bookingDate).isSame(dayjs().add(1, 'day'), 'day');
    $:console.log($bookingEstimate);
</script>

<div class="p-6">
    <h2 class="text-lg md:text-xl lg:text-2xl font-light text-gray-800 flex-grow">
        Today: {$now.format('ddd, MMM D YYYY')}
    </h2>

    <div class="absolute top-3 right-3 md:top-4 md:right-4">
        <a href="/report" class="block hover:scale-110 transition-transform duration-300">
            <img src={report_icon}
                 alt="Kid's helpline"
                 title="Kid's helpline"
                 class="w-8 h-8"/>
        </a>
    </div>


</div>
<div class="p-6 rounded-lg space-y-4">
    <p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
        Your appointment is
        {#if isTomorrow}
            <span class="underline">Tomorrow</span>
        {:else}
            on <span class="underline">{$bookingEstimate.bookingDateFormatted}</span>

        {/if}
        at
        <span class="underline">{$bookingEstimate.bookingTimeFormatted}</span>.
    </p>


    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        Please check this link on your appointment day for real-time updates!
    </div>

    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        <!--        Changes to your appointment online can ONLY be made before the day of your appointment.-->
        For further information, you can reach
        <span class="font-semibold">{$bookingEstimate.businessName}</span>
        at
        <span class="font-semibold">{formatPhoneNumber($bookingEstimate.businessPhoneNumber)}</span>.
    </div>
</div>
