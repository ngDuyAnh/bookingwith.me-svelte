
export function findIndividualBookingByID(customerBooking, individualID)
{
    for (let individualBooking of customerBooking.customerIndividualBookingList) {
        if (individualBooking.individualID === individualID)
        {
            return individualBooking;
        }
    }
    return null;
}

export function findServiceBookingByID(individualBooking, serviceBookingID)
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
