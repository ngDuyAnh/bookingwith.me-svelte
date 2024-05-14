export function Business()
{
    return {
        "business":BusinessInformation(),
        "serviceGroupList":[],
        "employeeList":[],
    }
}

export function BusinessInformation()
{
    return {
        "id":-1,
        "businessID": null,
        "businessName": "Booking With Me",
        "businessPhoneNumber": "123456789",
        "address": "123 street rd",
        "city": "Winnipeg",
        "province": "Manitoba",
        "country": "Canada",
        "postalCode": "R2M1A2",
        "websiteUrl": "app.bookingwith.me",
        "businessType": "Booking App",
        "socialMediaLink": "app.bookingwith.me",
        "timestamp": "",
        "active": true,
    };
}

export function Employee() {
    return {
        "id": -1,
        "employeeName": "",
        "archive": false,
    };
}

export function Service()
{
    return {
        "id": -1,
        "serviceName": "",
        "serviceCost": "",
        "serviceTimeLength": null,
        "description": "",
        "archive": false,
        "employeeList": [],
    };
}

export function ServiceGroup()
{
    return {
        "id ": -1,
        "serviceGroupName": "",
        "description": "",
        "archive": false,
        "serviceList": [],
    };
}