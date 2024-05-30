<script>
    import {Modal} from "flowbite-svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import CustomerBookingComponent from "$lib/components/CustomerBooking/CustomerBookingComponent.svelte";
    import {
        CustomerBooking,
        CustomerBookingChannel,
        CustomerIndividualBooking
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {newCustomerBooking} from "$lib/components/Modal/CreateCustomerBooking/newCustomerBooking.js";

    export let showCustomerBookingInformationFlagHeader = true;

    export let customerBookingInformationProps = {
        overrideFlag: false,
        sendSMSFlag: false
    };
    export let customerBookingInformationFormProps = {
        customerNameAutoComplete: true,
        requiredAgreeToReceiveSMS: false
    };

    export let business;
    export let customerBooking = {
        ...CustomerBooking($now),
        customerIndividualBookingList: [CustomerIndividualBooking()]
    };

    // Reset
    let wasOpen = $newCustomerBooking.open;
    $: if ($newCustomerBooking.open && !wasOpen)
    {
        wasOpen = true;
        
        customerBooking = {
            ...CustomerBooking($now),
            customerIndividualBookingList: [CustomerIndividualBooking()]
        };
    }
    else if (!$newCustomerBooking.open)
    {
        wasOpen = false;
    }
</script>

<div class="absolute top-0 left-0 right-0 ">
    <Modal bind:open={$newCustomerBooking.open} size="md" class="w-full max-w-3xl h-[80vh] border-8"
           bodyClass="p-4 md:p-5 space-y-0 flex-1 overflow-y-auto overscroll-contain"
           classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80">
        <svelte:fragment slot="header">
            <h1 class="select-none text-2xl text-gray-700 font-bold">
                New Booking
            </h1>
        </svelte:fragment>
        <CustomerBookingComponent
                bookingChannel={CustomerBookingChannel.LOBBY}

                {showCustomerBookingInformationFlagHeader}

                {customerBookingInformationProps}
                {customerBookingInformationFormProps}

                {business}
                {customerBooking}
        />
    </Modal>
</div>
