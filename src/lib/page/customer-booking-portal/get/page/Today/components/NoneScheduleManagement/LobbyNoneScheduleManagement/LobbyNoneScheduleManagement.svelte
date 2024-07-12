<script>
    import {customerBookingEstimate} from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
</script>

<div class="p-2 h-full w-full flex flex-col items-center justify-center">
    <!-- Appointment information box -->
    <div class="bg-white max-w-4xl border-2 rounded-lg">
        <!-- Appointment information -->
        <div class="p-4 flex justify-center text-green-800 space-x-4">
            <div class="flex flex-col items-center">
                <span>Servicing time</span>
                <div>
                    <span class="animate-pulse text-sm font-semibold">{$customerBookingEstimate.estimateServicingStartTime}</span>
                    <span class="text-sm">to</span>
                    <span class="animate-pulse text-sm font-semibold">{$customerBookingEstimate.estimateServicingEndTime}</span>
                </div>
            </div>
        </div>
    </div>
</div>
