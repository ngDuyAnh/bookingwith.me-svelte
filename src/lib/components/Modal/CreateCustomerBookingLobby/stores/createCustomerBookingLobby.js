import {writable} from "svelte/store";

export const modalCreateCustomerBookingLobby = writable({
    open: false,

    // Option header
    customerBookingInformationProps: {
        showSendSms: true,
        showLobbyBookingState: false,

        sendSmsFlag: true,
        lobbyBookingStateFlag: false
    },

    // Flag for fetching booking time availability
    pleaseFetchAvailability: false,

    // For submitting customer booking
    currentTimeString: undefined,
    bookingTimePeriod: undefined
});

export function handleNewCustomerBookingInLobbyPageForAppointment()
{
    modalCreateCustomerBookingLobby.set({
        open: true,

        // Option header
        customerBookingInformationProps: {
            showSendSms: true,
            showLobbyBookingState: true,

            sendSmsFlag: true,
            lobbyBookingStateFlag: false
        },

        // Flag for fetching booking time availability
        pleaseFetchAvailability: false,

        // For submitting customer booking
        currentTimeString: undefined,
        bookingTimePeriod: undefined
    });
}

export function handleNewCustomerBookingInLobbyPageForLobby()
{
    modalCreateCustomerBookingLobby.set({
        open: true,

        // Option header
        customerBookingInformationProps: {
            showSendSms: true,
            showLobbyBookingState: true,

            sendSmsFlag: false,
            lobbyBookingStateFlag: true
        },

        // Flag for fetching booking time availability
        pleaseFetchAvailability: false,

        // For submitting customer booking
        currentTimeString: undefined,
        bookingTimePeriod: undefined
    });
}

export function updateCurrentTimeString(newTimeString) {
    modalCreateCustomerBookingLobby.update(currentState => ({
        ...currentState,
        currentTimeString: newTimeString
    }));
}

export function updateBookingTimePeriod(newBookingTimePeriod) {
    modalCreateCustomerBookingLobby.update(currentState => ({
        ...currentState,
        bookingTimePeriod: newBookingTimePeriod
    }));
}

export function pleaseFetchAvailability() {
    modalCreateCustomerBookingLobby.update(currentState => ({
        ...currentState,
        pleaseFetchAvailability: true
    }));
}

export function availabilityFetched()
{
    modalCreateCustomerBookingLobby.update(currentState => ({
        ...currentState,
        pleaseFetchAvailability: false
    }));
}
