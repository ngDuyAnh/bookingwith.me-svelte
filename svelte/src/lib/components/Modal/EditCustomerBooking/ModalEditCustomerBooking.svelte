<script>
    import {Modal} from "flowbite-svelte";
    import CustomerBookingComponent from "$lib/components/CustomerBooking/CustomerBookingComponent.svelte";

    export let showCustomerBookingInformationFlagHeader = true;

    export let customerBookingInformationProps ={
        overrideFlag: false,
        sendSMSFlag: false
    };
    export let customerBookingInformationFormProps = {
        customerNameAutoComplete: true,
        requiredAgreeToReceiveSMS: false
    };

    export let open = false;
    export let business;
    export let customerBooking;
</script>

<div class="absolute top-0 left-0 right-0">
    <Modal bind:open={open} size="md" class="w-full max-w-3xl h-[80vh] border-8"
           bodyClass="p-4 md:p-5 space-y-0 flex-1 overflow-y-auto overscroll-contain"
           classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80">
        <svelte:fragment slot="header">
            <h1 class="text-2xl text-gray-700 font-bold">
                Edit Booking
            </h1>
        </svelte:fragment>
        <CustomerBookingComponent
                {showCustomerBookingInformationFlagHeader}
                {customerBookingInformationProps}
                {customerBookingInformationFormProps}

                {business}
                {customerBooking}
        />
    </Modal>
</div>
