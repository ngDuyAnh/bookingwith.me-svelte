import {get, writable} from 'svelte/store';
import {Transaction} from "$lib/api/initialize_functions/CustomerBooking.js";

export const checkoutCustomerBookingModal = writable({
    open: false,

    customerBooking: undefined,
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

    checkoutCustomerBookingModal.set({
        open: true,

        customerBooking: clonedCustomerBooking
    });
}

// export function handleCustomerBookingClickUpdate()
// {
//     const customerBookingClickModalValue = get(customerBookingClickModal);
//
//     // Find and reinitialize the customer booking for the modal
//     if (customerBookingClickModalValue.customerBooking)
//     {
//         const findID = customerBookingClickModalValue.customerBooking.id;
//         const foundCustomerBooking = findCustomerBookingById(findID);
//         if (customerBookingClickModalValue.open && foundCustomerBooking) {
//             handleCustomerBookingClick(foundCustomerBooking);
//         } else {
//             console.log('Customer booking not found for customer booking click modal.');
//             customerBookingClickModal.update(modal => {
//                 return {
//                     ...modal,
//                     open: false,
//                 };
//             });
//         }
//     }
// }
