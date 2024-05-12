import {formatToDate} from "$lib/application/Formatter.js";

export const CustomerBookingState = {
    APPOINTMENT: 0,
    LOBBY: 1,
    SERVICING: 2,
    COMPLETED: 3,
    SCHEDULE: 4
}

export function CustomerBooking(now)
{
    return {
        "id": -1,
        "bookingID": "",
        "customer": {
            "phoneNumber": "",
            "customerName": ""
        },
        "bookingDate": now.format(formatToDate),
        "bookingTime": null,
        "message": "",
        "bookingState": -1,
        "checkinTime": null,
        "servicingStartTime": null,
        "servicingEndTime": null,
        "customerIndividualBookingList": []
    };
}

export function CustomerIndividualBooking()
{
    return {
        "bookingID": "",
        "individualID": -1,
        "customerIndividualServiceBookingList": []
    };
}

export function CustomerIndividualServiceBooking()
{
    return {
        "bookingID": "",
        "individualID": -1,
        "serviceBookingID": -1,
        "employee": null,
        "service": null,
        "completed": false,
        "servicingTicketList": []
    };
}
