import { TimePeriod } from "$lib/api/initialize_functions/TimePeriod.js";
import { today } from "$lib/page/stores/now/now_dayjs_store.js";

export const CustomerBookingState = {
    APPOINTMENT: 0,
    LOBBY: 1,
    SERVICING: 2,
    COMPLETED: 3,
    SCHEDULE: 4
}

export const CustomerBookingChannel = {
    LOBBY: 0,
    ONLINE: 1,
    REVIEW: 2
}

export const CustomerBookingCost = {
    LOBBY: 4,
    ONLINE: 8,
    SMS: 2
}

export function CustomerBookingReview() {
    return {
        "id": -1,
        "bookingID": "",
        "reviewText": "",
        "rating": 0
    };
}

export function Customer(phoneNumber) {
    return {
        "phoneNumber": phoneNumber,
        "customerName": ""
    };
}

export function CustomerBooking() {
    return {
        "id": -1,
        "bookingID": "",
        "customer": {
            "phoneNumber": "",
            "customerName": ""
        },

        "bookingState": CustomerBookingState.SCHEDULE,
        "bookingChannel": -1,

        "bookingDate": today(),
        "bookingTime": null,
        "message": "",

        "checkinTime": null,
        "servicingStartTime": null,
        "servicingEndTime": null,

        "walkIn": false,
        "noShow": false,
        "deleted": false,

        "smsConfirmationSent": false,
        "smsConfirmation": false,
        "smsAppointmentSent": false,
        "smsAppointmentReminderSid": null,
        "smsReviewReminderSent": false,

        "customerBookingReview": null,

        "customerIndividualBookingList": []
    };
}

export function CustomerIndividualBooking() {
    return {
        "bookingID": "",
        "individualID": -1,
        "customerIndividualServiceBookingList": []
    };
}

export function CustomerIndividualServiceBooking() {
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

export function ServicingTicketInfo() {
    return {
        "customerName": "",
        "bookingTime": null,
        "bookingState": -1,
        "service": null,
        "bookedEmployee": null
    };
}

export function ServicingTicket() {
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
