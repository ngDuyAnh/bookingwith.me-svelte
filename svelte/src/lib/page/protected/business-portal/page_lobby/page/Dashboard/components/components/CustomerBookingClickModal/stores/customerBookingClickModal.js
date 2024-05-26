import { writable } from 'svelte/store';

export const customerBookingClickModal = writable({
    open: false,
    customerBooking: undefined
});
