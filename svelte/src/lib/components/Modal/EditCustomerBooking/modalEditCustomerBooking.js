import { writable } from 'svelte/store';

export const modalEditCustomerBooking = writable({
    open: false,
    customerBooking: undefined,

    // Option header
    showCustomerBookingInformationOptionHeader: true,
    customerBookingInformationProps: {
        showOverride: true,
        showSendSms: true,
        showLobbyBookingState: false,

        overrideFlag: false,
        sendSMSFlag: false,
        lobbyBookingStateFlag: false
    },

    // Customer information form
    customerBookingInformationFormProps: {
        customerNameAutoComplete: true,
        requiredAgreeToReceiveSms: false
    }
});

export function handleEditCustomerBooking(customerBooking)
{
    modalEditCustomerBooking.set({
        open: true,
        customerBooking: JSON.parse(JSON.stringify(customerBooking)),

        // Option header
        showCustomerBookingInformationOptionHeader: true,
        customerBookingInformationProps: {
            showOverride: true,
            showSendSms: true,
            showLobbyBookingState: false,

            overrideFlag: false,
            sendSMSFlag: false,
            lobbyBookingStateFlag: false
        },

        // Customer information form
        customerBookingInformationFormProps: {
            customerNameAutoComplete: true,
            requiredAgreeToReceiveSms: false
        }
    });
}

export function handleCustomerBookingPortalEditCustomerBooking(customerBooking)
{
    modalEditCustomerBooking.set({
        open: true,
        customerBooking: JSON.parse(JSON.stringify(customerBooking)),

        // Option header
        showCustomerBookingInformationOptionHeader: false,
        customerBookingInformationProps: {
            showOverride: false,
            showSendSms: false,
            showLobbyBookingState: false,

            overrideFlag: false,
            sendSMSFlag: false,
            lobbyBookingStateFlag: false
        },

        // Customer information form
        customerBookingInformationFormProps: {
            customerNameAutoComplete: false,
            requiredAgreeToReceiveSms: false
        }
    });
}
