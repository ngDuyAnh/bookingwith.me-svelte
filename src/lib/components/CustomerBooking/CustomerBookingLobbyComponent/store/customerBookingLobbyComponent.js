import {writable} from "svelte/store";
import {today} from "$lib/page/stores/now/now_dayjs_store.js";

export const customerBookingLobbyComponent = writable({
    // Flag for fetching booking time availability
    pleaseFetchAvailability: false,

    // For submitting customer booking
    bookingDate: today(),
    currentTimeString: undefined,
    selectedAvailability: undefined
});

export function handleNewCustomerBookingLobbyComponent()
{
    customerBookingLobbyComponent.set({
        // Flag for fetching booking time availability
        pleaseFetchAvailability: false,

        // For submitting customer booking
        bookingDate: today(),
        currentTimeString: undefined,
        selectedAvailability: undefined
    });
}

export function pleaseFetchAvailability() {
    customerBookingLobbyComponent.update(currentState => ({
        ...currentState,
        pleaseFetchAvailability: true
    }));
}

export function availabilityFetched()
{
    customerBookingLobbyComponent.update(currentState => ({
        ...currentState,
        pleaseFetchAvailability: false
    }));
}

export function updateCurrentTime(newTimeString) {
    customerBookingLobbyComponent.update(currentState => ({
        ...currentState,
        currentTimeString: newTimeString
    }));
}

export function selectAvailability(availability) {
    customerBookingLobbyComponent.update(currentState => ({
        ...currentState,
        selectedAvailability: availability
    }));
}
