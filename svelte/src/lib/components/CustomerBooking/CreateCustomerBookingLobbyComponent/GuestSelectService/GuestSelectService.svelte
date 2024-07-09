<script>

    import SelectServiceBooking
        from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/GuestSelectService/components/SelectServiceBooking/SelectServiceBooking.svelte";

    export let individualBooking;
    export let selectedIndividual;

</script>

<!--List of service booking from the guest-->
<div class="flex flex-col">
    <span class="flex items-center w-full justify-center py-1 font-bold">Select Service(s) for Guest # {selectedIndividual+1} </span>
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

</div>

