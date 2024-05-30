import { writable } from 'svelte/store';

export const newCustomerBooking = writable({
    open: false
});

export function handleNewCustomerBooking()
{
    newCustomerBooking.set({
        open: true
    });
}
