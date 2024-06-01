import { writable } from 'svelte/store';

export const modalCreateCustomerBooking = writable({
    open: false,
    preselectForWalkin: false
});

export function handleNewCustomerBooking()
{
    modalCreateCustomerBooking.set({
        open: true,
        preselectForWalkin: false
    });
}

export function handleNewCustomerBookingWalkin()
{
    modalCreateCustomerBooking.set({
        open: true,
        preselectForWalkin: true
    });
}
