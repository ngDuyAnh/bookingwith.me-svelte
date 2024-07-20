<script>
    import SelectServiceBooking
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/GuestSelectService/components/SelectServiceBooking/SelectServiceBooking.svelte";

    export let individualBooking;
    export let serviceBookingIndex;
    export let serviceBooking;

    $: servicingTime = getServicingDuration();

    function getServicingDuration()
    {
        // Get it from the service booking
        let duration = serviceBooking.servicingDuration;

        // If no override duration is defined
        // Get it from the service
        if (!duration)
        {
            duration = serviceBooking.service.serviceTimeLength;
        }

        // Return
        return duration;
    }

    function handleServiceTimeLengthChange(event)
    {
        serviceBooking.servicingDuration = parseInt(event.target.value, 10);
    }

    // $: console.log("serviceBooking", serviceBooking)
</script>

<div class="relative bg-gray-100 border border-gray-300 p-4 mb-2 rounded">
    <span class="absolute top-0 left-1">{serviceBookingIndex + 1}.</span>
    <SelectServiceBooking
            bind:individualBooking={individualBooking}
            serviceBookingIndex={serviceBookingIndex}
    />
    <div class="mt-2 text-xs text-gray-700">
        <span class="font-semibold">Cost:</span> ${serviceBooking.service.serviceCost}
        <span class="font-semibold ml-4">~Length:</span>
        <input
                type="number"
                min="0"
                bind:value={servicingTime}
                class="w-12 p-0.5 border border-gray-300 rounded text-xs"
                on:input={handleServiceTimeLengthChange}
                placeholder="Length in minutes"
        /> minutes
    </div>
</div>