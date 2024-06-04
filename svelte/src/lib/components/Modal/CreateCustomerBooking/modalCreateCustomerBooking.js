import { writable } from 'svelte/store';

export const modalCreateCustomerBooking = writable({
    open: false,
    preselectForWalkin: false,

    // Option header
    showCustomerBookingInformationOptionHeader: true,
    customerBookingInformationProps: {
        showOverride: true,
        showSendSms: true,
        showLobbyBookingState: false,

        overrideFlag: false,
        sendSmsFlag: true,
        lobbyBookingStateFlag: false
    },

    // Customer information form
    customerBookingInformationFormProps: {
        customerNameAutoComplete: true,
        requiredAgreeToReceiveSms: false
    }
});

export function handleNewCustomerBooking()
{
    modalCreateCustomerBooking.set({
        open: true,
        preselectForWalkin: true,

        // Option header
        showCustomerBookingInformationOptionHeader: true,
        customerBookingInformationProps: {
            showOverride: true,
            showSendSms: true,
            showLobbyBookingState: false,

            overrideFlag: false,
            sendSmsFlag: true,
            lobbyBookingStateFlag: false
        },

        // Customer information form
        customerBookingInformationFormProps: {
            customerNameAutoComplete: true,
            requiredAgreeToReceiveSms: false
        }
    });
}

export function handleNewCustomerBookingWalkin()
{
    modalCreateCustomerBooking.set({
        open: true,
        preselectForWalkin: true,

        // Option header
        showCustomerBookingInformationOptionHeader: true,
        customerBookingInformationProps: {
            showOverride: true,
            showSendSms: true,
            showLobbyBookingState: true,

            overrideFlag: false,
            sendSmsFlag: false,
            lobbyBookingStateFlag: true,
        },

        // Customer information form
        customerBookingInformationFormProps: {
            customerNameAutoComplete: true,
            requiredAgreeToReceiveSms: false
        }
    });
}
