import {formatToTime} from "$lib/application/Formatter.js";
import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
import dayjs from "dayjs";
import {initializeCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";

export function moveToAppointment(now, customerBooking) {
    customerBooking.bookingState = CustomerBookingState.APPOINTMENT;

    // Reset the booking stats
    customerBooking.checkinTime = null;
    customerBooking.servicingStartTime = null;
    customerBooking.servicingEndTime = null;

    // Save the customer booking change
    initializeCustomerBooking(customerBooking)
        .then(() => {
            console.log("Moved customer booking to appointment.");
        })
        .catch(error => {
            console.error('Error moving customer booking to appointment:', error);
        });
}

export function moveToLobby(now, customerBooking) {
    customerBooking.bookingState = CustomerBookingState.LOBBY;

    if (!customerBooking.checkinTime) {
        customerBooking.checkinTime = now.format(formatToTime);
    }

    // Save the customer booking change
    initializeCustomerBooking(customerBooking)
        .then(() => {
            console.log("Moved customer booking to lobby.");
        })
        .catch(error => {
            console.error('Error moving customer booking to lobby:', error);
        });
}

export function moveToServicing(now, customerBooking) {
    customerBooking.bookingState = CustomerBookingState.SERVICING;

    // Initialize the checkin time if it is null
    if (!customerBooking.checkinTime) {
        customerBooking.checkinTime = now.format(formatToTime);
    }
    if (!customerBooking.servicingStartTime) {
        customerBooking.servicingStartTime = now.format(formatToTime);
    }

    // Save the customer booking change
    initializeCustomerBooking(customerBooking)
        .then(() => {
            console.log("Moved customer booking to servicing.");
        })
        .catch(error => {
            console.error('Error moving customer booking to servicing:', error);
        });
}

export function moveToCompleted(now, customerBooking) {
    customerBooking.bookingState = CustomerBookingState.COMPLETED;
    customerBooking.servicingEndTime = now.format(formatToTime);

    // Iterate over each individual booking
    customerBooking.customerIndividualBookingList.forEach(individualBooking => {
        // Iterate over each service booking in the individual booking
        individualBooking.customerIndividualServiceBookingList.forEach(serviceBooking => {
            // Mark service as completed
            serviceBooking.completed = true;

            // Mark all tickets within the service as completed
            serviceBooking.servicingTicketList.forEach(ticket => {
                if (!ticket.isCompleted) {
                    ticket.timePeriod.endTime = dayjs().format(formatToTime); // Set end time to now
                }
            });
        });
    });

    // Save the customer booking change
    initializeCustomerBooking(customerBooking)
        .then(() => {
            console.log("Moved customer booking to completed.");
        })
        .catch(error => {
            console.error('Error moving customer booking to completed:', error);
        });
}
