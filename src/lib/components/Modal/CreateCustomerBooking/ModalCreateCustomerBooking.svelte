<script>
    import {Modal} from "flowbite-svelte";
    import CustomerBookingComponent
        from "$lib/components/CustomerBooking/CustomerBookingComponent/CustomerBookingComponent.svelte";
    import {
        CustomerBooking,
        CustomerBookingChannel,
        CustomerIndividualBooking
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        modalCreateCustomerBooking
    } from "$lib/components/Modal/CreateCustomerBooking/stores/modalCreateCustomerBooking.js";

    export let business;
    export let customerBooking = {
        ...CustomerBooking(),
        customerIndividualBookingList: [CustomerIndividualBooking()]
    };

    // Reset
    let wasOpen = $modalCreateCustomerBooking.open;
    $: if ($modalCreateCustomerBooking.open && !wasOpen) {
        wasOpen = true;

        customerBooking = {
            ...CustomerBooking(),
            customerIndividualBookingList: [CustomerIndividualBooking()]
        };
    } else if (!$modalCreateCustomerBooking.open) {
        wasOpen = false;
    }
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$modalCreateCustomerBooking.open}
           bodyClass="p-4 md:p-5 space-y-0 flex-1 overflow-y-auto overscroll-contain"
           class="w-full max-w-3xl h-[80vh] border-8"
           classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80"
           size="md">
        <svelte:fragment slot="header">
            <h1 class="select-none text-2xl text-gray-700 font-bold">
                New Booking
            </h1>
        </svelte:fragment>
        <CustomerBookingComponent
                bookingChannel={CustomerBookingChannel.LOBBY}

                {business}
                {customerBooking}

                customerIndividualBookingServiceSelectProps={$modalCreateCustomerBooking.customerIndividualBookingServiceSelectProps}

                customerBookingInformationFormProps={$modalCreateCustomerBooking.customerBookingInformationFormProps}

                customerBookingInformationProps={$modalCreateCustomerBooking.customerBookingInformationProps}
        />
    </Modal>
</div>
