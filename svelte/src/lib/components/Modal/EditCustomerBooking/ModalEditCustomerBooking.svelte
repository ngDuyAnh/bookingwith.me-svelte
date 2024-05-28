<script>
    import {Modal} from "flowbite-svelte";
    import CustomerBookingComponent from "$lib/components/CustomerBooking/CustomerBookingComponent.svelte";
    import {editCustomerBooking} from "$lib/components/Modal/EditCustomerBooking/editCustomerBooking.js";

    export let showCustomerBookingInformationFlagHeader = true;

    export let customerBookingInformationProps ={
        overrideFlag: false,
        sendSMSFlag: false
    };
    export let customerBookingInformationFormProps = {
        customerNameAutoComplete: true,
        requiredAgreeToReceiveSMS: false
    };

    export let business;
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$editCustomerBooking.open} size="md"
           class="w-full max-w-3xl h-[80vh] border-8 border-dotted"
           classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80">
        <svelte:fragment slot="header">
            <h1 class="select-none text-2xl text-gray-700 font-bold">
                Edit Booking
            </h1>
        </svelte:fragment>
        <CustomerBookingComponent
                {showCustomerBookingInformationFlagHeader}
                {customerBookingInformationProps}
                {customerBookingInformationFormProps}

                {business}
                customerBooking={$editCustomerBooking.customerBooking}
        />
    </Modal>
</div>
