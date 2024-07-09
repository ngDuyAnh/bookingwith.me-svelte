<script>
    import {
        CustomerBooking,
        CustomerBookingChannel,
        CustomerIndividualBooking
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        modalCreateCustomerBookingLobby
    } from "$lib/components/Modal/CreateCustomerBookingLobby/stores/createCustomerBookingLobby.js";
    import {Modal} from "flowbite-svelte";
    import CreateCustomerBookingLobbyComponent
        from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/CreateCustomerBookingLobbyComponent.svelte";

    export let customerBooking = {
        ...CustomerBooking(),
        customerIndividualBookingList: [CustomerIndividualBooking()]
    };

    // Reset
    let wasOpen = $modalCreateCustomerBookingLobby.open;
    $: if ($modalCreateCustomerBookingLobby.open && !wasOpen) {
        wasOpen = true;

        customerBooking = {
            ...CustomerBooking(),
            customerIndividualBookingList: [CustomerIndividualBooking()]
        };
    } else if (!$modalCreateCustomerBookingLobby.open) {
        wasOpen = false;
    }

</script>


<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$modalCreateCustomerBookingLobby.open}
           bodyClass="p-4 md:p-5 space-y-0 flex-1 overflow-y-auto overscroll-contain"
           class="w-full h-[80vh] border-8"
           classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80"
           size='xl'>
        <svelte:fragment slot="header">
            <h1 class="select-none text-2xl text-gray-700 font-bold">
                New Booking
            </h1>
        </svelte:fragment>
        <CreateCustomerBookingLobbyComponent
                bookingChannel={CustomerBookingChannel.LOBBY}

                {customerBooking}
        />
    </Modal>
</div>
