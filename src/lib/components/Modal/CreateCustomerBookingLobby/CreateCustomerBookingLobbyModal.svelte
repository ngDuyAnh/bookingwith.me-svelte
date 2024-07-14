<script>
    import {
        CustomerBooking,
        CustomerBookingChannel,
        CustomerIndividualBooking
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        modalCreateCustomerBookingLobby
    } from "$lib/components/Modal/CreateCustomerBookingLobby/stores/createCustomerBookingLobby.js";
    import {Modal, Toggle, Tooltip} from "flowbite-svelte";
    import CustomerBookingLobbyComponent
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/CustomerBookingLobbyComponent.svelte";
    import {isToday} from "$lib/page/stores/now/now_dayjs_store.js";

    export let customerBooking = {
        ...CustomerBooking(),
        customerIndividualBookingList: [CustomerIndividualBooking()]
    };

    export let customerBookingInformationProps = {
        showOverride: false,
        showSendSms: false,
        showLobbyBookingState: false,

        overrideFlag: false,
        sendSmsFlag: true,
        lobbyBookingStateFlag: false,
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
            <h1 class="select-none whitespace-nowrap text-2xl text-gray-700 font-bold">
                New Booking
            </h1>

            <div class="mt-4 flex flex-wrap justify-center items-center w-full space-x-4">
                {#if customerBookingInformationProps.showOverride}
                    <div class="flex items-center">
                        <Toggle bind:checked={customerBookingInformationProps.overrideFlag}>Override
                        </Toggle>
                        <Tooltip>Override booking time</Tooltip>
                    </div>
                {/if}

                {#if customerBookingInformationProps.showSendSms}
                    <div class="flex items-center">
                        <Toggle bind:checked={customerBookingInformationProps.sendSmsFlag} class="toggle">SMS</Toggle>
                        <Tooltip>Notify customer through SMS</Tooltip>
                    </div>
                {/if}

                {#if customerBookingInformationProps.showAppointmentBookingState}
                    <div class="flex items-center {isToday(customerBooking.bookingDate) ? '' : 'hidden'}">
                        <Toggle
                                bind:checked={customerBookingInformationProps.appointmentBookingStateFlag}>
                            Appointment
                        </Toggle>
                        <Tooltip>Move booking to appointment</Tooltip>
                    </div>
                {/if}

                {#if customerBookingInformationProps.showLobbyBookingState}
                    <div class="flex items-center {isToday(customerBooking.bookingDate) ? '' : 'hidden'}">
                        <Toggle
                                bind:checked={customerBookingInformationProps.lobbyBookingStateFlag}>
                            Lobby
                        </Toggle>
                        <Tooltip>Move booking to lobby</Tooltip>
                    </div>
                {/if}
            </div>
        </svelte:fragment>
        <CustomerBookingLobbyComponent
                bookingChannel={CustomerBookingChannel.LOBBY}

                {customerBooking}
        />
    </Modal>
</div>
