import {get, writable} from "svelte/store";
import {findCustomerBookingById} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
import {
    findServiceBookingFromCustomerBooking
} from "$lib/api/initialize_functions/utilitiy_functions/CustomerBooking.js";

export const servicingTicketClickModal = writable({
    open: false,
    employeeTimetableList: undefined,
    customerBooking: undefined,
    serviceBooking: undefined
});

export async function servicingTicketClickModalOpenWithServicingTicketEventInfo(servicingTicketEventInfo) {
    // Get the customer booking and service booking associated with the servicing ticket
    let customerBooking = findCustomerBookingById(
        servicingTicketEventInfo.event.extendedProps.servicingTicket.bookingID
    );

    /*
    This is the version to fetch the customer booking

    let customerBooking = await getCustomerBooking(
        servicingTicketEventInfo.event.extendedProps.servicingTicket.bookingID
    );
    */

    let serviceBooking = findServiceBookingFromCustomerBooking(
        customerBooking,
        servicingTicketEventInfo.event.extendedProps.servicingTicket.serviceBookingID
    );

    servicingTicketClickModalOpen(customerBooking, serviceBooking);
}

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

export function servicingTicketClickModalSetEmployeeTimetableList(employeeTimetableList) {
    servicingTicketClickModal.update(modal => {
        return {
            ...modal,
            employeeTimetableList: employeeTimetableList
        };
    });
}

export function servicingTicketClickModalToggleOpen() {
    servicingTicketClickModal.update(modal => {
        return {...modal, open: !modal.open};
    });
}

export async function handleTimetableUpdateForServicingTicketClickModal(employeeTimetableList) {
    // Set the new employee timetable list
    servicingTicketClickModalSetEmployeeTimetableList(employeeTimetableList);

    const modalState = get(servicingTicketClickModal);

    // Fetch and reinitialize the customer booking for the modal
    if (modalState.open &&
        modalState.customerBooking &&
        modalState.serviceBooking) {
        let customerBooking = findCustomerBookingById(
            modalState.customerBooking.bookingID
        );

        let serviceBooking = undefined;
        if (customerBooking) {
            serviceBooking = findServiceBookingFromCustomerBooking(
                customerBooking,
                modalState.serviceBooking.serviceBookingID
            );
        }

        // Set the updated customer booking and service booking
        if (customerBooking && serviceBooking) {
            servicingTicketClickModal.update(modal => {
                return {
                    ...modal,
                    customerBooking: customerBooking,
                    serviceBooking: serviceBooking
                };
            });

            // Reopen the modal with updated bookings
            servicingTicketClickModalOpen(customerBooking, serviceBooking);
        }
        // Close the modal, customer booking no longer exist, maybe deleted
        else
        {
            servicingTicketClickModal.update(modal => {
                return {
                    ...modal,
                    open: false,
                    customerBooking: undefined,
                    serviceBooking: undefined
                };
            });
        }
    }
}
