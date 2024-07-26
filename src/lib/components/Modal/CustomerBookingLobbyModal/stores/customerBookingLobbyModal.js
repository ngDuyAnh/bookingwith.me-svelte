import {get, writable} from "svelte/store";
import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";

export const customerBookingLobbyModal = writable({
    open: false,

    customerBooking: undefined,

    // Option header
    customerBookingInformationProps: {
        showSendSms: true,
        showLobbyBookingState: false,

        sendSmsFlag: true,
        lobbyBookingStateFlag: false
    }
});

export function isEditCustomerBooking()
{
    const customerBookingLobbyModalValue = get(customerBookingLobbyModal);

    let isEdit = false;
    if (customerBookingLobbyModalValue.customerBooking &&
        customerBookingLobbyModalValue.customerBooking.id !== -1)
    {
        isEdit = true;
    }

    // Return
    return isEdit;
}

export function handleNewCustomerBookingLobbyModalForAppointment()
{
    customerBookingLobbyModal.set({
        open: true,

        customerBooking: {
            ...CustomerBooking(),
            customerIndividualBookingList: [CustomerIndividualBooking()]
        },

        // Option header
        customerBookingInformationProps: {
            showSendSms: true,
            showLobbyBookingState: true,

            sendSmsFlag: true,
            lobbyBookingStateFlag: false
        }
    });
}

export function handleNewCustomerBookingLobbyModalForLobby()
{
    customerBookingLobbyModal.set({
        open: true,

        customerBooking: {
            ...CustomerBooking(),
            customerIndividualBookingList: [CustomerIndividualBooking()]
        },

        // Option header
        customerBookingInformationProps: {
            showSendSms: true,
            showLobbyBookingState: true,

            sendSmsFlag: false,
            lobbyBookingStateFlag: true
        }
    });
}

export function handleEditCustomerBookingLobbyModal(customerBooking)
{
    customerBookingLobbyModal.set({
        open: true,

        customerBooking: JSON.parse(JSON.stringify(customerBooking)),

        // Option header
        customerBookingInformationProps: {
            showSendSms: true,
            showLobbyBookingState: false,

            sendSmsFlag: false,
            lobbyBookingStateFlag: false
        }
    });
}
