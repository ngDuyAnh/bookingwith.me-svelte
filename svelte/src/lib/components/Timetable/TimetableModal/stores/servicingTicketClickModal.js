import {writable} from "svelte/store";

export const servicingTicketClickModal = writable({
    open: false,
    employeeTimetableList: undefined,
    customerBooking: undefined,
    serviceBooking: undefined
});

export function servicingTicketClickModalOpen(customerBooking, serviceBooking)
{
    servicingTicketClickModal.update(modal => {
        return {
            ...modal,
            open: true,
            customerBooking: customerBooking,
            serviceBooking: serviceBooking
        };
    });
}

export function servicingTicketClickModalSetEmployeeTimetableList(employeeTimetableList)
{
    servicingTicketClickModal.update(modal => {
        return {
            ...modal,
            employeeTimetableList: employeeTimetableList
        };
    });
}

export function servicingTicketClickModalToggleOpen()
{
    servicingTicketClickModal.update(modal => {
        return { ...modal, open: !modal.open };
    });
}
