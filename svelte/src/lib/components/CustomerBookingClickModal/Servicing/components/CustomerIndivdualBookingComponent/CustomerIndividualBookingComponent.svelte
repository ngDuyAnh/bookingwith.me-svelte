<script>
    import CustomerIndividualServiceBookingComponent
        from "$lib/components/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualServiceBookingComponent/CustomerIndividualServiceBookingComponent.svelte";

    export let customerBooking;
    export let individualBooking;
</script>

<div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
    {#each individualBooking.customerIndividualServiceBookingList as serviceBooking}
        <div class="mt-1 p-1">
            <CustomerIndividualServiceBookingComponent
                    {customerBooking}
                    {serviceBooking}
            />
        </div>
    {/each}
</div>
