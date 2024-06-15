import { writable } from 'svelte/store';

export const modalEditCustomerBooking = writable({
    open: false,
    customerBooking: undefined,

    showAllEmployeeSelectOptions: true,

    // Option header
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

        showAllEmployeeSelectOptions: true,

        // Option header
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

        showAllEmployeeSelectOptions: true,

        // Option header
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
