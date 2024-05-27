import {writable} from "svelte/store";

export const servicingTicketClickModal = writable({
    open: false,
    employeeTimetableList: undefined,
    customerBooking: undefined,
    serviceBooking: undefined
});

export function toggleOpen()
{
    servicingTicketClickModal.update(modal => {
        return { ...modal, open: !modal.open };
    });
}
