<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import report_icon from "$lib/images/report_icon/message-report.png";
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
                 class="w-8 h-8" />
        </a>
    </div>
</div>
<div class="rounded-lg space-y-4">
    <p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
        Your appointment is on
        <span class="underline">{$bookingEstimate.bookingDateFormatted}</span> at
        <span class="underline">{$bookingEstimate.bookingTimeFormatted}</span>.
    </p>

    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        Please check this link on your appointment day for real-time updates!
    </div>
</div>
