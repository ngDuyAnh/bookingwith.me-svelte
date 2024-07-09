<script>
    import {Modal} from "flowbite-svelte";
    import CreateCustomerBookingComponent
        from "$lib/components/CustomerBooking/CreateCustomerBookingComponent/CreateCustomerBookingComponent.svelte";
    import {modalEditCustomerBooking} from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {CustomerBookingChannel} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        modalCreateCustomerBooking
    } from "$lib/components/Modal/CreateCustomerBooking/stores/modalCreateCustomerBooking.js";

    export let business;

    //$: console.log("$modalEditCustomerBooking.customerBooking", $modalEditCustomerBooking.customerBooking)
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$modalEditCustomerBooking.open} size="md"
           class="w-full max-w-3xl h-[80vh] border-8 border-dotted"
           classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80">
        <svelte:fragment slot="header">
            <h1 class="select-none text-2xl text-gray-700 font-bold">
                Edit Booking
            </h1>
        </svelte:fragment>
        <CreateCustomerBookingComponent
                bookingChannel={CustomerBookingChannel.LOBBY}

                {business}
                customerBooking={$modalEditCustomerBooking.customerBooking}

                customerIndividualBookingServiceSelectProps={$modalCreateCustomerBooking.customerIndividualBookingServiceSelectProps}

                customerBookingInformationProps={$modalEditCustomerBooking.customerBookingInformationProps}

                customerBookingInformationFormProps={$modalEditCustomerBooking.customerBookingInformationFormProps}
        />
    </Modal>
</div>
