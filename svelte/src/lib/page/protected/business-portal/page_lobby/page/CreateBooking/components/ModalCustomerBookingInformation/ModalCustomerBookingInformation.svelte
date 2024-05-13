<script>
    import {Modal, Toggle} from "flowbite-svelte";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import CustomerBookingInformationForm
        from "$lib/components/Form/CustomerBookingInformationForm/CustomerBookingInformationForm.svelte";

    export let open = false;
    export let overrideFlag = false;
    export let sendSMS = true;
    export let customerBooking;
    export let customerIndividualList;
    export let submitCallback;

    // Reset the input formatted phone number
    let firstOpen = false;
    $: if (!firstOpen && open)
    {
        firstOpen = true;
    }
    // Optional: Reset the flag if you need to handle modal re-opening
    $: if (!open)
    {
        firstOpen = false; // Reset the flag when modal is closed
    }
</script>

<Modal bind:open={open} size="xs" outsideclose>
    <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">Booking information</h3>
        <div class="flex items-center space-x-2">
            <Toggle bind:checked={overrideFlag} class="toggle">Override</Toggle>
            <Toggle bind:checked={sendSMS} class="toggle">SMS</Toggle>
        </div>
    </div>

    <div class="mt-6">
       <CustomerBookingInformationForm
               businessId={$businessInfo.business.businessId}
               {customerBooking}
               {customerIndividualList}
               customerNameAutoComplete={true}
               {overrideFlag}
               {submitCallback}
       />
    </div>
</Modal>
