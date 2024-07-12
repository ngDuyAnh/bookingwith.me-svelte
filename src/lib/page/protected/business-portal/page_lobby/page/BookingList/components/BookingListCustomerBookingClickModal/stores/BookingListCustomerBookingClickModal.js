import {writable} from "svelte/store";

export const bookingListCustomerBookingClickModal = writable({
    open: false,
    customerBooking: undefined
});

export function handleBookingListCustomerBookingClick(customerBooking)
{
    bookingListCustomerBookingClickModal.set({
        open: true,
        customerBooking: customerBooking
    });
}
