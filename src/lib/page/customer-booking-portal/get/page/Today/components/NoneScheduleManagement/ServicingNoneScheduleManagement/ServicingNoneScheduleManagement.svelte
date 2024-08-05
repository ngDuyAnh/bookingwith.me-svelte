<script>
    import {
        customerBooking,
        customerBookingEstimate
    } from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
    import {shortCustomerBookingID} from "$lib/api/utility_functions/CustomerBooking.js";
</script>

<div class="p-2 h-full w-full flex flex-col items-center justify-center">
    <!-- Appointment information box -->
    <div class="bg-white max-w-4xl border-2 rounded-lg">

        <div class="p-4 text-sm">
            <span>Appointment ID: {shortCustomerBookingID($customerBooking.id)}</span>
        </div>

        <!-- Appointment information -->
        <div class="p-4 text-green-800 text-sm">
            <span>Estimate servicing end time is</span>
            <span class="animate-pulse text-sm font-semibold">{$customerBookingEstimate.estimateServicingEndTime}</span>
        </div>
    </div>
</div>
