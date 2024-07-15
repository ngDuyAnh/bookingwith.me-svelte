<script>
    import {
        CustomerBooking,
        CustomerBookingChannel,
        CustomerIndividualBooking
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        modalCreateCustomerBookingLobby
    } from "$lib/components/Modal/CreateCustomerBookingLobby/stores/createCustomerBookingLobby.js";
    import {Button, Checkbox, Modal} from "flowbite-svelte";
    import CustomerBookingLobbyComponent
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/CustomerBookingLobbyComponent.svelte";
    import {CalendarMonthOutline, CashSolid, UsersGroupSolid} from "flowbite-svelte-icons";

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

    let successfulSubmition;
    let totalServiceCost = 0;
    let totalGuests = 0;

    $:if (customerBooking) {
        totalServiceCost = 0;
        totalGuests = 0;

        customerBooking.customerIndividualBookingList.forEach(individualBooking => {
            totalGuests += 1;
            individualBooking.customerIndividualServiceBookingList.forEach(booking => {
                totalServiceCost += booking.service.serviceCost;
            });
        })
    }
</script>


<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$modalCreateCustomerBookingLobby.open}
           classHeader="!p-1"
           classBody="p-4 md:p-5 space-y-0 flex-1 overflow-y-auto overscroll-contain"
           class="w-full h-[80vh] border-8"
           classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80"
           size='xl'>
        <svelte:fragment slot="header">
            <div class="flex sm:flex-row flex-col justify-evenly items-center w-full">
                <h1 class="select-none whitespace-nowrap text-2xl text-gray-700 font-bold flex flex-row">
                    <CalendarMonthOutline size="xl"/>
                    Create Booking
                </h1>
                {#if !successfulSubmition}
                    <div class="flex flex-row items-center justify-start space-x-2">
                        <span class="flex flex-row"><UsersGroupSolid/> Guest(s):  {totalGuests}</span>
                        <span class="flex flex-row"><CashSolid/> Total: ${totalServiceCost}</span>
                    </div>
                {/if}
            </div>
        </svelte:fragment>

        <!--        body-->
        <CustomerBookingLobbyComponent
                bookingChannel={CustomerBookingChannel.LOBBY}
                bind:customerBooking={customerBooking}
                bind:successfulSubmition={successfulSubmition}
        />

        <svelte:fragment slot="footer">
            <!--Optional actions-->
            {#if !successfulSubmition}
                <div class="w-full flex justify-end space-x-2">
                    <div class="flex flex-row space-x-2">
                        {#if $modalCreateCustomerBookingLobby.customerBookingInformationProps.showSendSms}
                            <Checkbox
                                    bind:checked={$modalCreateCustomerBookingLobby.customerBookingInformationProps.sendSmsFlag}>
                                Send SMS
                            </Checkbox>
                        {/if}

                        {#if $modalCreateCustomerBookingLobby.customerBookingInformationProps.showLobbyBookingState}
                            <Checkbox
                                    bind:checked={$modalCreateCustomerBookingLobby.customerBookingInformationProps.lobbyBookingStateFlag}>
                                Lobby
                            </Checkbox>
                        {/if}
                    </div>

                    <Button form="bookingForm" type="submit" class="">
                        Create
                    </Button>
                </div>
            {/if}
        </svelte:fragment>
    </Modal>
</div>
