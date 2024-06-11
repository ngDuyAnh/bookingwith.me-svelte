<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import LiveIndicator
        from "$lib/page/customer-booking-portal/get/page/components/LiveIndicator/LiveIndicator.svelte";
</script>

<div class="h-full w-full flex flex-col items-center justify-center">
    <!-- Appointment information box -->
    <div class="bg-white max-w-4xl border-2 rounded-lg">
        <!-- Appointment header -->
        <div class="p-4 text-xl font-bold text-blue-900">
            <div class="flex flex-row items-center justify-center w-full">
                <LiveIndicator/>
            </div>
        </div>

        <!-- Appointment information -->
        <div class="p-4 text-green-800 text-sm">
            <span>Estimate servicing end time is</span>
            <span class="animate-pulse text-sm font-semibold">{$bookingEstimate.estimateServicingEndTime}</span>
        </div>
    </div>
</div>
