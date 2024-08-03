import {writable} from 'svelte/store';
import {Transaction} from "$lib/api/initialize_functions/CustomerBooking.js";

export const checkOutCustomerBookingModal = writable({
    open: false,

    customerBooking: undefined
});

export function handleCheckoutCustomerBookingClick(customerBooking)
{
    // Cloned the customer booking
    let clonedCustomerBooking = JSON.parse(JSON.stringify(customerBooking));

    // Initialize with transaction if not existed
    if (!clonedCustomerBooking.transaction)
    {
        clonedCustomerBooking.transaction = Transaction();
    }

    checkOutCustomerBookingModal.set({
        open: true,

        customerBooking: clonedCustomerBooking
    });
}

export function handleCloseCheckoutCustomerBooking()
{
    checkOutCustomerBookingModal.set({
        open: false,

        customerBooking: undefined
    });
}
