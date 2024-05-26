<script>
import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
</script>

<div class="p-6 bg-white rounded-lg space-y-4">
    <div class="bg-green-100 text-green-800 rounded-lg p-4 shadow-lg items-center">
        <span class="">Your position in the queue is </span>
        <span class="text-lgn font-semibold">{$bookingEstimate.queuePosition}</span>
    </div>
    <div class="bg-green-100 text-green-800 rounded-lg p-4 shadow-lg items-center">
        <span class="">Estimate start servicing time is from </span>
        <span class="text-lgn font-semibold">{$bookingEstimate.estimateServicingStartTime}</span>
        <span class="">to</span>
        <span class="text-lgn font-semibold">{$bookingEstimate.estimateServicingEndTime}</span>
    </div>
</div>
