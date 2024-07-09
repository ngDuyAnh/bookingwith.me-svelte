<script>

    import SelectServiceBooking
        from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/GuestSelectService/components/SelectServiceBooking/SelectServiceBooking.svelte";

    export let individualBooking;

    $: console.log("individualBooking", individualBooking);
</script>

<!--List of service booking from the guest-->
<ul class="flex-grow px-4 py-1 shadow w-full overflow-y-auto space-y-2">
    {#key individualBooking.customerIndividualServiceBookingList.length}
        <!--Selected service booking-->
        {#each individualBooking.customerIndividualServiceBookingList as serviceBooking, index (serviceBooking)}
            <SelectServiceBooking
                    bind:individualBooking={individualBooking}
                    serviceBookingIndex={index}
            />
        {/each}

        <!--Create new service booking-->
        <span>New service</span>
        <SelectServiceBooking
                bind:individualBooking={individualBooking}
                serviceBookingIndex={individualBooking.customerIndividualServiceBookingList.length}
        />
    {/key}
</ul>
