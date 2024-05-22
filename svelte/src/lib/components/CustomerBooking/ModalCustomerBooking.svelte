<script>
    import {Modal} from "flowbite-svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import CustomerBookingComponent from "$lib/components/CustomerBooking/CustomerBookingComponent.svelte";
    import {
        CustomerBooking, CustomerBookingChannel,
        CustomerIndividualBooking
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions/CustomerBooking.js";

    export let showCustomerBookingInformationFlagHeader = false;

    export let open = false;
    export let business;
    export let customerBooking = {
        ...CustomerBooking($now),
        customerIndividualBookingList: [CustomerIndividualBooking()]
    };

    export let customerBookingInformationFormProps = {
        customerNameAutoComplete: false,
        requiredAgreeToReceiveSMS: true
    };

    // Reset
    $: if (open)
    {
        customerBooking = {
            ...CustomerBooking($now),
            customerIndividualBookingList: [CustomerIndividualBooking()]
        };
    }
</script>

<div class="absolute top-0 left-0 right-0">
    <Modal bind:open={open} size="md" class="w-full max-w-3xl h-[80vh] border-dotted border-8" classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80"  outsideclose>
        <CustomerBookingComponent
                bookingChannel={CustomerBookingChannel.LOBBY}

                {showCustomerBookingInformationFlagHeader}
                {customerBookingInformationFormProps}

                {business}
                {customerBooking}
        />
    </Modal>
</div>
