import {get, writable} from 'svelte/store';
import {findCustomerBookingById} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";

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

export function handleCustomerBookingClickUpdate()
{
    const customerBookingClickModalValue = get(customerBookingClickModal);

    // Find and reinitialize the customer booking for the modal
    if (customerBookingClickModalValue.customerBooking)
    {
        const findID = customerBookingClickModalValue.customerBooking.id;
        const foundCustomerBooking = findCustomerBookingById(findID);
        if (customerBookingClickModalValue.open && foundCustomerBooking) {
            handleCustomerBookingClick(foundCustomerBooking);
        } else {
            console.log('Customer booking not found for customer booking click modal.');
            customerBookingClickModal.update(modal => {
                return {
                    ...modal,
                    open: false,
                };
            });
        }
    }
}
