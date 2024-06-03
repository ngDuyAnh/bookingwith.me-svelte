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

export function CustomerBookingReview()
{
    return {
        "id": -1,
        "bookingID": "",
        "reviewText": "",
        "rating": 0
    };
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

        "bookingState": CustomerBookingState.SCHEDULE,
        "bookingChannel": -1,

        "bookingDate": now.format(formatToDate),
        "bookingTime": null,
        "message": "",

        "checkinTime": null,
        "servicingStartTime": null,
        "servicingEndTime": null,

        "walkIn": false,
        "deleted": false,
        "smsAppointmentReminderSid": null,
        "smsReviewReminderSent": false,

        "customerBookingReview": null,

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
        "service": null,
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

        "timePeriod": TimePeriod(),

        "isFiller": false,
        "isOngoing": false,
        "isCompleted": false
    };
}