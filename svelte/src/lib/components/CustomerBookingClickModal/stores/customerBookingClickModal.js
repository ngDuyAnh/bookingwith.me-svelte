import {get, writable} from 'svelte/store';

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
        if (foundCustomerBooking) {
            customerBookingClickModal.update(current => {
                return {
                    ...current,
                    customerBooking: foundCustomerBooking
                };
            });
        }
        // Customer booking not found
        // Close the modal
        else {
            customerBookingClickModal.update(current => {
                return {
                    ...current,
                    open: false
                };
            });
            console.log('Customer booking not found for customer booking click modal.');
        }
    }
}
