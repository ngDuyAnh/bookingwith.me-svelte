import {writable} from "svelte/store";

export const servicingTicketClickModal = writable({
    open: false,
    employeeTimetableList: undefined,
    customerBooking: undefined,
    serviceBooking: undefined
});
