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
        "bookingID": -1,
        "customer": {
            "phoneNumber": "",
            "customerName": ""
        },
        "bookingDate": now.format(formatToDate),
        "bookingTime": null,
        "message": "",
        "checkinTime": null,
        "servicingStartTime": null,
        "servicingEndTime": null,
        "bookingState": -1
    };
}
