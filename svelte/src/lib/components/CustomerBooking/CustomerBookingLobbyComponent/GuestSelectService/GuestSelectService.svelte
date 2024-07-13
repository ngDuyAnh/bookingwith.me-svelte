<script>
    import SelectServiceBooking
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/GuestSelectService/components/SelectServiceBooking/SelectServiceBooking.svelte";

    export let customerBooking;
    export let individualBookingIndex;

    $: individualBooking = customerBooking.customerIndividualBookingList[individualBookingIndex];
</script>

<!--List of service booking from the guest-->
<div class="flex flex-col m-1">
    {#key individualBooking.customerIndividualServiceBookingList.length}
<!--        <div class="flex items-center justify-center mb-4">-->
<!--            <span class="text-sm text-gray-700">Services for Guest #{individualBookingIndex + 1}</span>-->
<!--        </div>-->
        <!-- Each loop for existing services -->
        {#each individualBooking.customerIndividualServiceBookingList as serviceBooking, index (serviceBooking)}
            <div class="bg-gray-100 border border-gray-300 p-4 mb-2 rounded">
                <SelectServiceBooking
                        bind:individualBooking={individualBooking}
                        serviceBookingIndex={index}
                />
            </div>
        {/each}

        <!-- Section for adding a new service booking -->
        <div class="bg-green-100 border-2 border-dashed border-green-300 p-6 mt-4 rounded text-bold">
            <span class="block text-green-700 mb-2">Add New Service for Guest #{individualBookingIndex + 1}</span>
            <SelectServiceBooking
                    newServiceSelect={true}
                    bind:individualBooking={individualBooking}
                    serviceBookingIndex={individualBooking.customerIndividualServiceBookingList.length}
            />
        </div>
    {/key}
</div>
