import {User} from "$lib/api/initialize_functions/User.js";

export const BusinessScheduleManagement = {
    NONE: 0,
    PASSIVE: 1,
    ACTIVE: 2
}

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
        "stripeID": null,

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
        "scheduleManagement": BusinessScheduleManagement.NONE,

        "stripeLastReportedDate": null
    };
}

export function Employee() {
    return {
        "id": -1,
        "employeeName": "",
        "user": User(),

        "showOnlineBookingPage": true,
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
        "showOnlineBookingPage": true,

        "archive": false,
        "employeeList": [],
    };
}

export function ServiceGroup()
{
    return {
        "id": -1,
        "serviceGroupName": "",
        "description": "",
        "multiselect": false,
        "showOnlineBookingPage": true,
        "serviceList": [],

        "archive": false
    };
}
