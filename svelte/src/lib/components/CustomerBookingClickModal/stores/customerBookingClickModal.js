import { writable } from 'svelte/store';

export const customerBookingClickModal = writable({
    open: false,
    customerBooking: undefined
});

export function handleCustomerBookingClick(customerBooking)
{
    customerBookingClickModal.set({
        open: true,
        customerBooking: customerBooking
    });
}
