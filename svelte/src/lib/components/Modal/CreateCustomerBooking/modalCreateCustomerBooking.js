import { writable } from 'svelte/store';

export const modalCreateCustomerBooking = writable({
    open: false,
    preselectForWalkin: false,

    // Option header
    showCustomerBookingInformationOptionHeader: true,
    overrideFlag: false,
    sendSMSFlag: true,

    // Customer information form
    customerNameAutoComplete: true,
    requiredAgreeToReceiveSMS: false
});

export function handleNewCustomerBooking()
{
    modalCreateCustomerBooking.set({
        open: true,
        preselectForWalkin: false,

        // Option header
        showCustomerBookingInformationOptionHeader: true,
        overrideFlag: false,
        sendSMSFlag: true,

        // Customer information form
        customerNameAutoComplete: true,
        requiredAgreeToReceiveSMS: false
    });
}

export function handleNewCustomerBookingWalkin()
{
    modalCreateCustomerBooking.set({
        open: true,
        preselectForWalkin: true,

        // Option header
        showCustomerBookingInformationOptionHeader: true,
        overrideFlag: false,
        sendSMSFlag: false,

        // Customer information form
        customerNameAutoComplete: true,
        requiredAgreeToReceiveSMS: false
    });
}
