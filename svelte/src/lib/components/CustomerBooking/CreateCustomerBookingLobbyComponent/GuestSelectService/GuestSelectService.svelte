<script>

    import SelectServiceBooking
        from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/GuestSelectService/components/SelectServiceBooking/SelectServiceBooking.svelte";

    export let customerIndividualBooking;

</script>

<!--List of service booking-->
<SelectServiceBooking/>
<button
        on:click={() => {}}
        class="ml-4 text-red-500 cursor-pointer"
>
    Delete
</button>