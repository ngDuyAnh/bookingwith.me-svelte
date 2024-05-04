<script>
    import CustomerIndividualServiceBooking
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/CustomerIndividualBooking/CustomerIndividualServiceBooking/CustomerIndividualServiceBooking.svelte";

    export let customerBooking;
    export let individualBooking;

</script>

<div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
    {#each individualBooking.customerIndividualServiceBookingList as serviceBooking}
        <div class="mt-1 p-1">
            <CustomerIndividualServiceBooking {customerBooking} {individualBooking} {serviceBooking}/>
        </div>
    {/each}
</div>
