import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
import {
    initializeCustomerBookingAndBroadcast
} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
import {nowTime} from "$lib/page/stores/now/now_dayjs_store.js";

export function moveToAppointment(customerBooking) {
    customerBooking.bookingState = CustomerBookingState.APPOINTMENT;

    // Reset the booking stats
    customerBooking.checkinTime = null;
    customerBooking.servicingStartTime = null;
    customerBooking.servicingEndTime = null;

    // Save the customer booking change
    initializeCustomerBookingAndBroadcast(customerBooking, nowTime())
        .then(() => {
            console.log("Moved customer booking to appointment.");
        })
        .catch(error => {
            console.error('Error moving customer booking to appointment:', error);
        });
}

export function moveToLobby(customerBooking) {
    const currentTime = nowTime();

    customerBooking.bookingState = CustomerBookingState.LOBBY;

    if (!customerBooking.checkinTime) {
        customerBooking.checkinTime = currentTime;
    }

    // Save the customer booking change
    initializeCustomerBookingAndBroadcast(customerBooking, currentTime)
        .then(() => {
            console.log("Moved customer booking to lobby.");
        })
        .catch(error => {
            console.error('Error moving customer booking to lobby:', error);
        });
}

export function moveToServicing(customerBooking) {
    const currentTime = nowTime();

    customerBooking.bookingState = CustomerBookingState.SERVICING;
    customerBooking.noShow = false;

    // Initialize the checkin time if it is null
    if (!customerBooking.checkinTime) {
        customerBooking.checkinTime = currentTime;
    }
    if (!customerBooking.servicingStartTime) {
        customerBooking.servicingStartTime = currentTime;
    }

    // Save the customer booking change
    initializeCustomerBookingAndBroadcast(customerBooking, currentTime)
        .then(() => {
            console.log("Moved customer booking to servicing.");
        })
        .catch(error => {
            console.error('Error moving customer booking to servicing:', error);
        });
}

export function moveToCompleted(customerBooking) {
    const currentTime = nowTime();

    customerBooking.bookingState = CustomerBookingState.COMPLETED;
    customerBooking.servicingEndTime = currentTime;

    // Iterate over each individual booking
    customerBooking.customerIndividualBookingList.forEach(individualBooking => {
        // Iterate over each service booking in the individual booking
        individualBooking.customerIndividualServiceBookingList.forEach(serviceBooking => {
            // Mark service as completed
            serviceBooking.completed = true;

            // Mark all tickets within the service as completed
            serviceBooking.servicingTicketList.forEach(ticket => {
                if (!ticket.isCompleted) {
                    ticket.timePeriod.endTime = currentTime;
                }
            });
        });
    });

    // Save the customer booking change
    initializeCustomerBookingAndBroadcast(customerBooking, currentTime)
        .then(() => {
            console.log("Moved customer booking to completed.");
        })
        .catch(error => {
            console.error('Error moving customer booking to completed:', error);
        });
}
