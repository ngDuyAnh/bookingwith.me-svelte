import { User } from "$lib/api/initialize_functions/User.js";

export const BusinessScheduleManagement = {
    NONE: 0,
    PASSIVE: 1,
    ACTIVE: 2
}

export function Business() {
    return {
        "businessInfo": BusinessInformation(),
        "serviceGroupList": [],
        "employeeList": [],
    }
}

export function BusinessInformation() {

    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
        "id": -1,
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

        "timezone": localTimezone,

        "active": true,
        "scheduleManagement": BusinessScheduleManagement.NONE,

        "stripeLastReportedDate": null
    };
}

export function TestBusinessInformation() {
    return {
        "id": -1,
        "businessID": null,
        "stripeID": null,

        "businessName": "test",
        "businessPhoneNumber": "1111111111",
        "websiteUrl": "qwewe",
        "businessType": "qwe",
        "socialMediaLink": "qweqwe",

        "googleReviewLink": "ewew",
        "googleMapsLink": "wewe",
        "googleEmbedMapLink": "weew",
        "googleMapsDirectionLink": "wewe",

        "active": true,
        "scheduleManagement": BusinessScheduleManagement.NONE,
    };
}

export function Employee() {
    return {
        "id": -1,
        "employeeName": "",
        "phoneNumber": "",
        "user": User(),

        "showOnlineBookingPage": true,
        "archive": false
    };
}

export function ServiceBreakRule()
{
    return {
        "workingDuration": 0,
        "freeDuration": 0
    };
}

export function Service() {
    return {
        "id": -1,
        "serviceName": "",
        "serviceCost": "",
        "serviceTimeLength": null,
        "description": "",

        "showPlus": false,
        "showOnlineBookingPage": true,

        "highlight": false,

        "archive": false,
        "employeeList": [],
    };
}

export function ServiceGroup() {
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
