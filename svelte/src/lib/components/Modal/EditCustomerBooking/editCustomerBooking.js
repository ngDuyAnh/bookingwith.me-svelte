import { writable } from 'svelte/store';

export const editCustomerBooking = writable({
    open: false,
    customerBooking: undefined
});

export function handleEditCustomerBooking(customerBooking)
{
    editCustomerBooking.set({
        open: true,
        customerBooking: JSON.parse(JSON.stringify(customerBooking))
    });
}
