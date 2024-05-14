import {formatToDate} from "$lib/application/Formatter.js";

export function Business(now)
{
    return {
        "business":businessInformation(now),
        "serviceGroupList":[],
        "employeeList":[],
    }
}

export function businessInformation(now)
{
    return {
        "id":-1,
        "businessId": null,
        "businessName": "",
        "businessPhoneNumber": "",
        "contactPhoneNumber": "",
        "businessEmail": "",
        "ownerName": "",
        "address": "",
        "city": "Winnipeg",
        "province": "Manitoba",
        "country": "Canada",
        "postalCode": "",
        "websiteUrl": "",
        "businessType": "",
        "socialMediaLink": "",
        "registrationDate": now.format(formatToDate),
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