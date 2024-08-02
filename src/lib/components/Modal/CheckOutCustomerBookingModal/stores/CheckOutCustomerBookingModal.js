import {get, writable} from 'svelte/store';

export const checkoutCustomerBookingModal = writable({
    open: false,

    customerBooking: undefined,
});

export function handleCheckoutCustomerBookingClick(customerBooking)
{
    checkoutCustomerBookingModal.set({
        open: true,

        customerBooking: JSON.parse(JSON.stringify(customerBooking)),
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
