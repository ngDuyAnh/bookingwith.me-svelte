import {get, writable} from "svelte/store";
import {findCustomerBookingById} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
import {
    findServiceBookingFromCustomerBooking
} from "$lib/api/utility_functions/CustomerBooking.js";

export const servicingTicketClickModal = writable({
    open: false,
    employeeTimetableList: undefined,
    customerBooking: undefined,
    serviceBooking: undefined
});

function update(id, serviceBookingID) {
    /*
    This is the version to fetch the customer booking

    let customerBooking = await getCustomerBooking(
        servicingTicketEventInfo.event.extendedProps.servicingTicket.bookingID
    );
    */

    // Get the customer booking and service booking associated with the servicing ticket
    let customerBooking = findCustomerBookingById(id);
    let serviceBooking = undefined;
    if (customerBooking)
    {
        serviceBooking = findServiceBookingFromCustomerBooking(
            customerBooking,
            serviceBookingID
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

        // Update
        servicingTicketClickModalOpen(customerBooking, serviceBooking);
    }
    // Close the modal, customer booking or service booking no longer exist, maybe deleted
    else {
        console.log('Customer booking not found for servicing ticket click modal.');
        servicingTicketClickModal.update(modal => {
            return {
                ...modal,
                open: false,
            };
        });
    }
}

export function servicingTicketClickModalOpenWithServicingTicketEventInfo(servicingTicketEventInfo) {
    update(
        servicingTicketEventInfo.event.extendedProps.servicingTicket.servicingTicketInfo.id,
        servicingTicketEventInfo.event.extendedProps.servicingTicket.serviceBookingID
    );
}

export function servicingTicketClickModalOpen(customerBooking, serviceBooking) {
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

        update(
            modalState.customerBooking.id,
            modalState.serviceBooking.serviceBookingID
        );
    }
}
