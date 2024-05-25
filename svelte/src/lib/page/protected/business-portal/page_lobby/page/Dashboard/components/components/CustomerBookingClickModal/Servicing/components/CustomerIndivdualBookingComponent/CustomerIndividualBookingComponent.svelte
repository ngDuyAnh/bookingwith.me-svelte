<script>
    import CustomerIndividualServiceBookingComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualServiceBookingComponent/CustomerIndividualServiceBookingComponent.svelte";

    export let customerBooking;
    export let individualBooking;
    export let specificBooking = null;
</script>

<div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
    {#each individualBooking.customerIndividualServiceBookingList as serviceBooking}
        {#if serviceBooking.individualID !== specificBooking.individualID }
            <div class="mt-1 p-1">
                <CustomerIndividualServiceBookingComponent
                        {customerBooking}
                        {serviceBooking}
                />
            </div>
        {/if}
    {/each}
</div>
