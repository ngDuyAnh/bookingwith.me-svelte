import { writable } from 'svelte/store';

export const modalEditCustomerBooking = writable({
    open: false,
    customerBooking: undefined,

    // Option header
    showCustomerBookingInformationOptionHeader: true,
    overrideFlag: false,
    sendSMSFlag: false,

    // Customer information form
    customerNameAutoComplete: true,
    requiredAgreeToReceiveSMS: false
});

export function handleEditCustomerBooking(customerBooking)
{
    modalEditCustomerBooking.set({
        open: true,
        customerBooking: JSON.parse(JSON.stringify(customerBooking)),

        // Option header
        showCustomerBookingInformationOptionHeader: true,
        overrideFlag: false,
        sendSMSFlag: false,

        // Customer information form
        customerNameAutoComplete: true,
        requiredAgreeToReceiveSMS: false
    });
}
