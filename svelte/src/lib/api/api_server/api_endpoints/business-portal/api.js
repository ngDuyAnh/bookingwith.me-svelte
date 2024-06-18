import {API_BASE_URL} from "$lib/api/api_server/API-URL.js";

const API_URL = `${API_BASE_URL}/business-portal`;

export async function createBusiness(businessInformation) {
    const FETCH_URL = `${API_URL}/create`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(businessInformation)
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return response.json();
}

export async function getBusiness(id) {
    const FETCH_URL = `${API_URL}/get-business/${id}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function initializeBusiness(business) {
    const FETCH_URL = `${API_URL}/initialize-business`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(business)
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getEmployeeWorkSchedule(employeeId) {
    const FETCH_URL = `${API_URL}/get-employee-work-schedule/${employeeId}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function initializeEmployeeWorkSchedule(employeeWorkSchedule) {
    const FETCH_URL = `${API_URL}/initialize-employee-work-schedule`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeWorkSchedule)
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getCustomerBookingList(businessID, startDate, endDate) {
    const FETCH_URL = `${API_URL}/get-customer-booking-list/${businessID}?startDate=${startDate}&endDate=${endDate}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}
