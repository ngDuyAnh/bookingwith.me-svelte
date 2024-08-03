<script>
    import {Button, Modal} from "flowbite-svelte";
    import {CartOutline} from "flowbite-svelte-icons";
    import {
        checkOutCustomerBookingModal, handleCloseCheckoutCustomerBooking
    } from "$lib/components/Modal/CheckOutCustomerBookingModal/stores/checkOutCustomerBookingModal.js";
    import CheckoutCustomerBookingComponent
        from "$lib/components/CheckoutCustomerBooking/CheckoutCustomerBookingComponent/CheckoutCustomerBookingComponent.svelte";

    let showHeaderAndFooter = true;
    function submitCallback(hideHeaderAndFooter) {
        showHeaderAndFooter = !hideHeaderAndFooter;

        // Close the modal
        setTimeout(() => {
            handleCloseCheckoutCustomerBooking();
        }, 1000);
    }
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$checkOutCustomerBookingModal.open}
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
            </div>
        </svelte:fragment>

        <CheckoutCustomerBookingComponent
            bind:customerBooking={$checkOutCustomerBookingModal.customerBooking}
            {submitCallback}
        />

        <svelte:fragment slot="footer">
            {#if showHeaderAndFooter}
                <Button form="checkoutForm" type="submit" class="ml-auto">
                    Checkout
                </Button>
            {/if}
        </svelte:fragment>
    </Modal>
</div>
