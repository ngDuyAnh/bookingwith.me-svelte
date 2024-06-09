<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import LiveIndicator
        from "$lib/page/customer-booking-portal/get/page/components/LiveIndicator/LiveIndicator.svelte";
</script>

<div class="h-full w-full flex flex-col items-center justify-center p-6 rounded-lg space-y-4">
    <div class="flex items-center justify-center">
        <div class="w-full max-w-4xl">
            <!-- Appointment header -->
            <div class="relative text-xl rounded-t-lg font-bold flex bg-white text-blue-900 p-4 border-t-2 border-x-2">
                <div class="flex flex-row items-center justify-center w-full">
                    <LiveIndicator/>
                </div>
            </div>

            <!-- Appointment information -->
            <div class="relative flex flex-col bg-white text-green-800 p-4 border-x-2 border-b-2 rounded-b-lg w-full">
                <div class="flex justify-between w-full mt-auto">
                    <span>Estimate servicing end time is</span>
                    <div>
                        <span class="animate-pulse text-sm font-semibold ml-1">{$bookingEstimate.estimateServicingEndTime}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
