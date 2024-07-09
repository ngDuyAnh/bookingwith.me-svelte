import {writable} from "svelte/store";

export const modalCreateCustomerBookingLobby = writable({
    open: false,
});

export function handleNewCustomerBookingLobby()
{
    modalCreateCustomerBookingLobby.set({
        open: true,
    });
}
