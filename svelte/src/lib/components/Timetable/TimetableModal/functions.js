import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";

export  function indicateToSendCustomerBookingToCompleted(customerBooking)
{
    // Indicate to send the customer booking to completed
    // It must be under servicing
    let indicateSendToCompleted = false;
    if (customerBooking.bookingState === CustomerBookingState.SERVICING) {
        // Get the service booking list
        let serviceBookingList = customerBooking.customerIndividualBookingList.map(
            individualBooking => individualBooking.customerIndividualServiceBookingList
        ).flat();

        // Count completed and currently servicing bookings
        let incompleteServiceBookingCount = 0;
        let incompleteServicingTicketCount = 0;
        serviceBookingList.forEach((serviceBooking) => {
            if (!serviceBooking.completed) {
                incompleteServiceBookingCount += 1;

                // Check if there is only one servicing ticket that is not completed
                if (serviceBooking.servicingTicketList.length > 0) {
                    serviceBooking.servicingTicketList.forEach((servicingTicket) => {
                        if (!servicingTicket.completed) {
                            incompleteServicingTicketCount += 1;
                        }
                    })
                }
            }
        });

        // All service bookings are completed or only one left, and it is currently being servicing
        if (incompleteServiceBookingCount === 0 || (incompleteServiceBookingCount === 1 && incompleteServicingTicketCount === 1)) {
            indicateSendToCompleted = true;
        }
    }

    // Return
    return indicateSendToCompleted;
}

export function findPreselectEmployeeID(employeeTimetableList, serviceBooking)
{
    for (let employeeTimetable of employeeTimetableList)
    {
        for (let ticket of employeeTimetable.servicingTicketList)
        {
            if (ticket.serviceBookingID === serviceBooking.serviceBookingID) {
                return employeeTimetable.employee.id;
            }
        }
    }
    return null;
}
