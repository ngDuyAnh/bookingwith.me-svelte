import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
import {
    initializeCustomerBookingAndBroadcast
} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
import {nowTime} from "$lib/page/stores/now/now_dayjs_store.js";
import {timetableComponent} from "$lib/components/Timetable/stores/timetableComponent.js";
import {get} from "svelte/store";

export async function moveToAppointment(customerBooking) {
    customerBooking.bookingState = CustomerBookingState.APPOINTMENT;

    // Reset the booking stats
    customerBooking.checkinTime = null;
    customerBooking.servicingStartTime = null;
    customerBooking.servicingEndTime = null;

    // Reset the service booking start time
    customerBooking.customerIndividualBookingList.forEach(individualBooking => {
        individualBooking.customerIndividualServiceBookingList.forEach(serviceBooking => {
            serviceBooking.startTime = null;
        });
    });

    // Save the customer booking change
    await initializeCustomerBookingAndBroadcast(customerBooking, nowTime())
        .then(() => {
            console.log("Moved customer booking to appointment.");
        })
        .catch(error => {
            console.error('Error moving customer booking to appointment:', error);
        });
}

export async function moveToLobby(customerBooking) {
    const currentTime = nowTime();

    customerBooking.bookingState = CustomerBookingState.LOBBY;

    if (!customerBooking.checkinTime) {
        customerBooking.checkinTime = currentTime;
    }

    // Save the customer booking change
    await initializeCustomerBookingAndBroadcast(customerBooking, currentTime)
        .then(() => {
            console.log("Moved customer booking to lobby.");
        })
        .catch(error => {
            console.error('Error moving customer booking to lobby:', error);
        });
}

export async function moveToServicing(customerBooking) {
    const currentTime = nowTime();
    const timetableComponentValue = get(timetableComponent);

    customerBooking.bookingState = CustomerBookingState.SERVICING;
    customerBooking.noShow = false;

    // Initialize the checkin time if it is null
    if (!customerBooking.checkinTime) {
        customerBooking.checkinTime = currentTime;
    }
    if (!customerBooking.servicingStartTime) {
        customerBooking.servicingStartTime = currentTime;
    }

    // Initialize the service booking with the scheduled start time and assigned employee
    customerBooking.customerIndividualBookingList.forEach(individualBooking => {
        individualBooking.customerIndividualServiceBookingList.forEach(serviceBooking => {
            // Find the earliest start time and assigned employee from the tickets
            let earliestStartTime = null;
            let assignedEmployee = null;
            timetableComponentValue.employeeTimetableList.forEach(employeeTimetable => {
                employeeTimetable.servicingTicketList.forEach(ticket => {
                    let ticketStartTime = ticket.timePeriod.startTime;
                    if (ticket.serviceBookingID === serviceBooking.serviceBookingID &&
                        (!earliestStartTime || ticketStartTime < earliestStartTime)) {
                        earliestStartTime = ticketStartTime;
                        assignedEmployee = employeeTimetable.employee;
                    }
                });
            });

            // Assign the employee and start time
            serviceBooking.startTime = earliestStartTime;
            serviceBooking.assignedEmployee = assignedEmployee;
        });
    });

    // Save the customer booking change
    await initializeCustomerBookingAndBroadcast(customerBooking, currentTime)
        .then(() => {
            console.log("Moved customer booking to servicing.");
        })
        .catch(error => {
            console.error('Error moving customer booking to servicing:', error);
        });
}

export async function moveToCompleted(customerBooking) {
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
    await initializeCustomerBookingAndBroadcast(customerBooking, currentTime)
        .then(() => {
            console.log("Moved customer booking to completed.");
        })
        .catch(error => {
            console.error('Error moving customer booking to completed:', error);
        });
}
