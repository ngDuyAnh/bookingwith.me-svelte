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
    <Modal bind:open={open} size="md" class="w-full max-w-3xl h-[80vh] border-dotted border-8" classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80"  outsideclose>
        <CustomerBookingComponent
                {showCustomerBookingInformationFlagHeader}
                {customerBookingInformationProps}
                {customerBookingInformationFormProps}

                {business}
                {customerBooking}
        />
    </Modal>
</div>
