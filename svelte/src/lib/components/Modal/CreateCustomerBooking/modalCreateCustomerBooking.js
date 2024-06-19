import { writable } from 'svelte/store';

export const modalCreateCustomerBooking = writable({
    open: false,

    showAllEmployeeSelectOptions: true,

    // Customer individual booking select service
    customerIndividualBookingServiceSelectProps: {
        showAllServiceGroup: true,
        showAllService: true,
        showAllEmployeeSelectOptions: true
    },

    // Option header
    customerBookingInformationProps: {
        showOverride: true,
        showSendSms: true,
        showAppointmentBookingState: false,
        showLobbyBookingState: false,

        overrideFlag: false,
        sendSmsFlag: true,
        appointmentBookingStateFlag: false,
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

        // Customer individual booking select service
        customerIndividualBookingServiceSelectProps: {
            showAllServiceGroup: true,
            showAllService: true,
            showAllEmployeeSelectOptions: true
        },

        // Option header
        customerBookingInformationProps: {
            showOverride: true,
            showSendSms: true,
            showAppointmentBookingState: false,
            showLobbyBookingState: false,

            overrideFlag: false,
            sendSmsFlag: true,
            appointmentBookingStateFlag: false,
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

        // Customer individual booking select service
        customerIndividualBookingServiceSelectProps: {
            showAllServiceGroup: true,
            showAllService: true,
            showAllEmployeeSelectOptions: true
        },

        // Option header
        customerBookingInformationProps: {
            showOverride: true,
            showSendSms: true,
            showAppointmentBookingState: false,
            showLobbyBookingState: true,

            overrideFlag: false,
            sendSmsFlag: false,
            appointmentBookingStateFlag: false,
            lobbyBookingStateFlag: true
        },

        // Customer information form
        customerBookingInformationFormProps: {
            customerNameAutoComplete: true,
            requiredAgreeToReceiveSms: false
        }
    });
}
