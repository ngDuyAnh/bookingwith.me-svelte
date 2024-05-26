<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
</script>

<p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
    Your appointment is on
    <span class="underline">{$bookingEstimate.bookingDateFormatted}</span> at
    <span class="underline">{$bookingEstimate.bookingTimeFormatted}</span>.
</p>

<div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
    Please check this link on your appointment day for real-time updates!
</div>
