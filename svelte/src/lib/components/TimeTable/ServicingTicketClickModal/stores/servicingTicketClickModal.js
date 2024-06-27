import {get, writable} from "svelte/store";
import {getCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
import {
    findServiceBookingFromCustomerBooking
} from "$lib/api/initialize_functions/customer-booking-utility-functions.js";

export const servicingTicketClickModal = writable({
    open: false,
    employeeTimetableList: undefined,
    customerBooking: undefined,
    serviceBooking: undefined
});

export async function servicingTicketClickModalOpenWithServicingTicketEventInfo(servicingTicketEventInfo) {
    // Get the customer booking and service booking associated with the servicing ticket
    let customerBooking = await getCustomerBooking(
        servicingTicketEventInfo.event.extendedProps.servicingTicket.bookingID
    );
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
    if (modalState.open && modalState.customerBooking) {
        try {
            // Fetch the recent changes to the customer booking
            const fetchCustomerBooking = await getCustomerBooking(modalState.customerBooking.bookingID);

            if (fetchCustomerBooking) {
                // Get the latest service booking from the customer booking
                const fetchServiceBooking = findServiceBookingFromCustomerBooking(
                    fetchCustomerBooking,
                    modalState.serviceBooking.serviceBookingID
                );

                // Reopen the modal with updated bookings
                servicingTicketClickModalOpen(fetchCustomerBooking, fetchServiceBooking);
            } else {
                console.log('Customer booking not found for customer booking click modal.');
            }
        } catch (error) {
            console.error('Failed to fetch customer booking:', error);
        }
    }
}
