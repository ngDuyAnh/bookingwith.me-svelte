
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
