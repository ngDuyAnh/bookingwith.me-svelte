<script>

    import SelectServiceBooking
        from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/GuestSelectService/components/SelectServiceBooking/SelectServiceBooking.svelte";

    export let individualBooking;

</script>

<!--List of service booking from the guest-->
{#each individualBooking.customerIndividualServiceBookingList as serviceBooking, index (index)}
    <SelectServiceBooking {serviceBooking}/>
    <button
            on:click={() => {}}
            class="ml-4 text-red-500 cursor-pointer"
    >
        Delete
    </button>
{/each}

<!--Append a new service booking-->
<span>New service</span>
<SelectServiceBooking/>
