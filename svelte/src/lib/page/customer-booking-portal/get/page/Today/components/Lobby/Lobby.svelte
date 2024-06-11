<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import LiveIndicator
        from "$lib/page/customer-booking-portal/get/page/components/LiveIndicator/LiveIndicator.svelte";
</script>

<div class="p-2 h-full w-full flex flex-col items-center justify-center">
    <!-- Appointment information box -->
    <div class="bg-white max-w-4xl border-2 rounded-lg">
        <!-- Appointment header -->
        <div class="p-4 text-xl font-bold text-blue-900">
            <div class="flex flex-row items-center justify-center w-full">
                <LiveIndicator/>
            </div>
        </div>

        <!-- Appointment information -->
        <div class="p-4 flex justify-between text-green-800 space-x-4">
            <div class="flex flex-col">
                <span>Queue position</span>
                <span class="animate-pulse text-sm font-semibold">{$bookingEstimate.queuePosition}</span>
            </div>
            <div class="flex flex-col items-end">
                <span>Servicing time</span>
                <div>
                    <span class="animate-pulse text-sm font-semibold">{$bookingEstimate.estimateServicingStartTime}</span>
                    <span class="text-sm">to</span>
                    <span class="animate-pulse text-sm font-semibold">{$bookingEstimate.estimateServicingEndTime}</span>
                </div>
            </div>
        </div>
    </div>
</div>
