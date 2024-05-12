<script>
    import CustomerBookingInformationForm
        from "$lib/components/Form/CustomerBookingInformationForm/CustomerBookingInformationForm.svelte";


    export let handlePrev;
    export let businessId;
    export let businessName;
    export let handleSubmit;
    // export let disableOption = false;
    export let customerIndividualList;
    export let customerBooking;
</script>

<div class="flex flex-col items-center">
    <div class="flex justify-between items-center px-4 pt-4 w-full">
        <button
                class="flex items-center justify-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 ease-in-out"
                on:click={handlePrev}
                aria-label="Previous"
        >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
            </svg>
        </button>
    </div>

    <!-- Customer booking information -->
    <div class="mt-3 w-full h-full max-w-md p-8 border-2 border-gray-200 shadow-md rounded-lg">
        <CustomerBookingInformationForm
                businessId={businessId}
                customerBooking={$customerBooking}
                businessName={businessName}
                customerIndividualList={$customerIndividualList}
                submitCallback={handleSubmit}
                requiredAgreeToReceiveSMS={true}
        />
    </div>
</div>
