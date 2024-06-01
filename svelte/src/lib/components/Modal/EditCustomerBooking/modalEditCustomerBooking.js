import { writable } from 'svelte/store';

export const modalEditCustomerBooking = writable({
    open: false,
    customerBooking: undefined
});

export function handleEditCustomerBooking(customerBooking)
{
    modalEditCustomerBooking.set({
        open: true,
        customerBooking: JSON.parse(JSON.stringify(customerBooking))
    });
}
