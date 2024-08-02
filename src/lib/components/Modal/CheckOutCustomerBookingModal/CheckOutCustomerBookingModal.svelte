<script>
    import {Badge, Button, Checkbox, Modal} from "flowbite-svelte";
    import {CartOutline, CashSolid, UsersGroupSolid} from "flowbite-svelte-icons";
    import {
        customerBookingLobbyModal
    } from "$lib/components/Modal/CustomerBookingLobbyModal/stores/customerBookingLobbyModal.js";
    import {
        customerBookingLobbyComponent,
        resetCustomerBookingLobbyComponent
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";
    import {isToday} from "$lib/page/stores/business/business.js";
    import {
        CheckoutCustomerBookingModal
    } from "$lib/components/Modal/CheckOutCustomerBookingModal/stores/CheckOutCustomerBookingModal.js";
    import CheckoutCustomerBookingComponent
        from "$lib/components/CheckoutCustomerBooking/CheckoutCustomerBookingComponent/CheckoutCustomerBookingComponent.svelte";

    let totalServiceCost = 0;
    let totalGuests = 0;

    // Calculate the total number of guest and service cost for the header
    $:if ($customerBookingLobbyModal.customerBooking) {
        totalServiceCost = 0;
        totalGuests = 0;

        $customerBookingLobbyModal.customerBooking.customerIndividualBookingList.forEach(individualBooking => {
            totalGuests += 1;
            individualBooking.customerIndividualServiceBookingList.forEach(booking => {
                totalServiceCost += booking.service.serviceCost;
            });
        })
    }

    let focusIndividualColumnIndex = 1;
    let focusDualColumnIndex = 1;
    let showHeaderAndFooter = true;

    // Reset
    let wasOpen = $customerBookingLobbyModal.open;
    $: if ($customerBookingLobbyModal.open && !wasOpen) {
        wasOpen = true;

        // Reset store
        resetCustomerBookingLobbyComponent();

        // Reset to show the header and footer
        showHeaderAndFooter = true;
        focusIndividualColumnIndex = 1;
        focusDualColumnIndex = 1;
    } else if (!$customerBookingLobbyModal.open) {
        wasOpen = false;
    }

    function submitCallback(hideHeaderAndFooter) {
        showHeaderAndFooter = !hideHeaderAndFooter;
        focusIndividualColumnIndex = 1;
        focusDualColumnIndex = 1;
    }


    let showCreateButton = true;

    $: showCreateButton = focusIndividualColumnIndex === 4 || focusDualColumnIndex === 2;
    $: buttonKey = focusIndividualColumnIndex + focusDualColumnIndex;


</script>

<div class="absolute top-0 left-0 right-0 z-[2001]">
    <Modal bind:open={$CheckoutCustomerBookingModal.open}
           classHeader="!p-1"
           classBody="p-4 md:p-5 space-y-0 flex-1 overflow-y-auto overscroll-contain"
           class="xl:w-full sm:w-11/12 w-full h-[80vh] border-8 "
           classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80"
           size="xl"
    >
        <svelte:fragment slot="header">
            <div class="flex sm:flex-row flex-col sm:justify-between justify-center items-center w-full">
                <div class="w-1/2 flex sm:justify-start justify-center">
                    <h1 class="select-none whitespace-nowrap text-2xl text-gray-700 font-bold flex flex-row">
                        <CartOutline size="xl"/>
                        Checkout
                    </h1>
                </div>
                <!--{#if showHeaderAndFooter}-->
                <!--    <div class="w-1/2 flex justify-center">-->
                <!--        <div class="flex flex-row items-center space-x-2">-->
                <!--            <Badge color="dark" class="space-x-2" large>-->
                <!--                <span class="flex flex-row"><UsersGroupSolid/> Guest(s):  {totalGuests}</span>-->
                <!--                <span class="flex flex-row"><CashSolid/> Total: ${totalServiceCost}</span>-->
                <!--            </Badge>-->
                <!--        </div>-->
                <!--    </div>-->
                <!--{/if}-->
            </div>
        </svelte:fragment>

        <CheckoutCustomerBookingComponent
        bind:customerBooking={$CheckoutCustomerBookingModal.customerBooking}
        />

        <svelte:fragment slot="footer">
            <Button type="submit" class="ml-auto">
                Complete Booking
            </Button>
        </svelte:fragment>
    </Modal>
</div>
