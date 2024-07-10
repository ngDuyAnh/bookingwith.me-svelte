<script>

    import SelectServiceBooking
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/GuestSelectService/components/SelectServiceBooking/SelectServiceBooking.svelte";

    export let individualBooking;

    $: console.log("individualBooking", individualBooking);
</script>

<!--List of service booking from the guest-->
<div class="flex flex-col">
    {#key individualBooking.customerIndividualServiceBookingList.length}
        {#each individualBooking.customerIndividualServiceBookingList as serviceBooking, index (serviceBooking)}
            <SelectServiceBooking
                    bind:individualBooking={individualBooking}
                    serviceBookingIndex={index}
            />
        {/each}

        <!--Append a new service booking-->
        <span>New service</span>
        <SelectServiceBooking
                bind:individualBooking={individualBooking}
                serviceBookingIndex={individualBooking.customerIndividualServiceBookingList.length}
        />
    {/key}
</div>
