import {formatToDate} from "$lib/application/Formatter.js";
import {TimePeriod} from "$lib/api/initialize_functions/TimePeriod.js";

export const CustomerBookingState = {
    APPOINTMENT: 0,
    LOBBY: 1,
    SERVICING: 2,
    COMPLETED: 3,
    SCHEDULE: 4
}

export const CustomerBookingChannel = {
    LOBBY: 0,
    ONLINE: 1
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
        "bookingChannel": -1,

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

export function ServicingTicketInfo()
{
    return {
        "customerName": "",
        "bookingTime": null,
        "bookingState": -1,
        "bookedEmployee": null
    };
}

export function ServicingTicket()
{
    return {
        "bookingID": "",
        "individualID": -1,
        "serviceBookingID": -1,
        "ticketID": -1,

        "servicingTicketInfo": ServicingTicketInfo(),

        "employee": null,
        "service": null,

        "timePeriod": TimePeriod(),

        "isFiller": false,
        "isOngoing": false,
        "isCompleted": false
    };
}