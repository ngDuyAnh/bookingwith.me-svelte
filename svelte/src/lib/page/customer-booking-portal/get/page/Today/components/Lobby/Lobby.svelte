<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import LiveIndicator
        from "$lib/page/customer-booking-portal/get/page/components/LiveIndicator/LiveIndicator.svelte";
</script>


<div class="flex items-center justify-center min-h-screen"> <!-- Centering on the screen -->
    <div class="p-6 bg-white rounded-lg space-y-4 max-w-4xl w-full"> <!-- Limiting the max width and setting full width -->
        <div class="relative flex flex-col bg-white text-green-800 p-4 border-x-2 border-y-2 rounded-lg w-full">
            <div class="mx-auto">
                <LiveIndicator/>
            </div>
            <div class="flex justify-between w-full">
                <div class="flex flex-col">
                    <span>Queue position </span>
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
</div>
