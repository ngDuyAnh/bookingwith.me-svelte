import {User} from "$lib/api/initialize_functions/User.js";

export function Business()
{
    return {
        "businessInfo": BusinessInformation(),
        "serviceGroupList":[],
        "employeeList":[],
    }
}

export function BusinessInformation()
{
    return {
        "id":-1,
        "businessID": null,
        "businessName": "",
        "businessPhoneNumber": "",
        "address": "",
        "city": "",
        "province": "",
        "country": "",
        "postalCode": "",
        "websiteUrl": "",
        "businessType": "",
        "socialMediaLink": "",
        "googleReviewLink": "",
        "googleMapsLink": "",

        "active": true,
        "passiveManagement": false,

        "timestamp": "",
    };
}

export function Employee() {
    return {
        "id": -1,
        "employeeName": "",
        "user": User(),
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
        "multiselect": false,
        "serviceList": [],
        "archive": false
    };
}
