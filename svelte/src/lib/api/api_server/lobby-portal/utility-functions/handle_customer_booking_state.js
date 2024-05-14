import {formatToTime} from "$lib/application/Formatter.js";
import {CustomerBookingState} from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions.js";
import dayjs from "dayjs";

export async function moveToLobby(now, customerBooking, submitCustomerBooking)
{
    customerBooking.bookingState = CustomerBookingState.LOBBY;

    if (!customerBooking.checkinTime)
    {
        customerBooking.checkinTime = now.format(formatToTime);
    }

    // Save the customer booking change
    submitCustomerBooking(customerBooking);
}

export async function moveToServicing(now, customerBooking, submitCustomerBooking)
{
    customerBooking.bookingState = CustomerBookingState.SERVICING;

    // Initialize the checkin time if it is null
    if (!customerBooking.checkinTime)
    {
        customerBooking.checkinTime = now.format(formatToTime);
    }
    if (!customerBooking.servicingStartTime)
    {
        customerBooking.servicingStartTime = now.format(formatToTime);
    }

    // Save the customer booking change
    submitCustomerBooking(customerBooking);
}

export async function moveToCompleted(now, customerBooking, submitCustomerBooking)
{
    if (confirm("Are you sure you want to mark this as complete?"))
    {
        customerBooking.bookingState = CustomerBookingState.COMPLETED;

        if (!customerBooking.servicingEndTime)
        {
            customerBooking.servicingEndTime = now.format(formatToTime);
        }
        
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
