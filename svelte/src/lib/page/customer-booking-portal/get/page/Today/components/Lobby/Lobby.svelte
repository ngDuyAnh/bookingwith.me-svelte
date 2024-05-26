<script>
import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
</script>

<div>
    <div class="mt-4 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        Your position in the queue is {$bookingEstimate.queuePosition}
    </div>
    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        Estimate start servicing time is from {$bookingEstimate.estimateServicingStartTime} to {$bookingEstimate.estimateServicingEndTime}
    </div>
</div>