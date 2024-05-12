
export function Employee()
{
    return {
        "id": -1,
        "employeeName": "",
        "archive": false
    };
}

export function ServiceGroup()
{
    return {
        "id": -1,
        "serviceGroupName": "",
        "description": "",
        "archive": false,
        "serviceList": []
    };
}

export function Service()
{
    return {
        "id": -1,
        "serviceName": "",
        "serviceCost": 0.0,
        "serviceTimeLength": -1,
        "description": "",
        "archive": false,
        "employeeList": []
    };
}

export function ServicingTicketInfo()
{
    return {
        "customerName": "",
        "bookingTime": null,
        "bookedEmployee": null
    };
}

export function TimePeriod()
{
    return {
        "startTime": null,
        "endTime": null,
    };
}

export function ServicingTicket()
{
    return {
        "bookingID": -1,
        "servicingTicketInfo": ServicingTicketInfo(),
        "bookingState": -1,
        "individualID": -1,
        "serviceBookingID": -1,
        "ticketId": -1,
        "service": Service(),
        "employee": Employee(),
        "timePeriod": TimePeriod(),
        "archive": false,
        "employeeList": []
    };
}
