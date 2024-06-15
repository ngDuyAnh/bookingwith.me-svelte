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
        "websiteUrl": "",
        "businessType": "",
        "socialMediaLink": "",

        "googleReviewLink": "",
        "googleMapsLink": "",
        "googleEmbedMapLink": "",
        "googleMapsDirectionLink": "",

        "active": true,
        "passiveManagement": false
    };
}

export function Employee() {
    return {
        "id": -1,
        "employeeName": "",
        "user": User(),

        "showOnBookingPage": true,
        "archive": false
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
        "showPlus": false,

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
