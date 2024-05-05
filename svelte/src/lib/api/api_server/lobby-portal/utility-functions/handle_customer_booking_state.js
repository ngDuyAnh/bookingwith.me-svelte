import {formatToTime} from "$lib/application/Formatter.js";
import {CustomerBookingState} from "$lib/api/api_server/customer-booking-portal/initialize_functions.js";
import dayjs from "dayjs";

export async function moveToLobby(now, customerBooking, submitCustomerBooking)
{
    customerBooking.checkinTime = now.format(formatToTime);
    customerBooking.bookingState = CustomerBookingState.LOBBY;

    // Save the customer booking change
    submitCustomerBooking(customerBooking);
}

export async function moveToServicing(now, customerBooking, submitCustomerBooking)
{
    // Initialize the checkin time if it is null
    if (!customerBooking.checkinTime)
    {
        customerBooking.checkinTime = now.format(formatToTime);
    }
    customerBooking.servicingStartTime = now.format(formatToTime);
    customerBooking.bookingState = CustomerBookingState.SERVICING;

    // Save the customer booking change
    submitCustomerBooking(customerBooking);
}

export async function moveToCompleted(now, customerBooking, submitCustomerBooking)
{
    if (confirm("Are you sure you want to mark this as complete?"))
    {
        // Update customer booking
        customerBooking.servicingEndTime = now.format(formatToTime);
        customerBooking.bookingState = CustomerBookingState.COMPLETED;

        // Iterate over each individual booking
        customerBooking.customerIndividualBookingList.forEach(individualBooking => {
            // Iterate over each service booking in the individual booking
            individualBooking.customerIndividualServiceBookingList.forEach(serviceBooking => {
                // Mark service as completed
                serviceBooking.completed = true;

                // Mark all tickets within the service as completed
                serviceBooking.servicingTicketList.forEach(ticket => {
                    if (!ticket.completed)
                    {
                        ticket.completed = true;
                        ticket.timePeriod.endTime = dayjs().format(formatToTime); // Set end time to now
                    }
                });
            });
        });

        // Save the customer booking change
        await submitCustomerBooking(customerBooking);
    }
}
