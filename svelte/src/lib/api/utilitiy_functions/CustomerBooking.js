
export function shortCustomerBookingID(id)
{
    return (id % 1000).toString().padStart(3, '0');
}

export function findIndividualBookingFromCustomerBooking(customerBooking, individualID)
{
    for (let individualBooking of customerBooking.customerIndividualBookingList) {
        if (individualBooking.individualID === individualID)
        {
            return individualBooking;
        }
    }
    return null;
}

export function findServiceBookingFromIndividualBooking(individualBooking, serviceBookingID)
{
    for (let serviceBooking of individualBooking.customerIndividualServiceBookingList)
    {
        if (serviceBooking.serviceBookingID === serviceBookingID)
        {
            return serviceBooking;
        }
    }
    return null;
}

export function findServiceBookingFromCustomerBooking(customerBooking, serviceBookingID) {
    for (let individualBooking of customerBooking.customerIndividualBookingList) {
        let serviceBooking = findServiceBookingFromIndividualBooking(individualBooking, serviceBookingID);
        if (serviceBooking !== null) {
            return serviceBooking;
        }
    }
    return null;
}
