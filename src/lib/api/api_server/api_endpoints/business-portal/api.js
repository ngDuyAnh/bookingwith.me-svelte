import {PUBLIC_API_BASE_URL} from "$env/static/public";

const API_URL = `${PUBLIC_API_BASE_URL}/business-portal`;

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

export async function validateManagerAccess(id, password) {
    const FETCH_URL = `${API_URL}/validate-manager-access/${id}?password=${password}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }
}

export async function updateManagerPassword(businessID, newPassword) {
    const FETCH_URL = `${API_URL}/update-manager-password/${businessID}`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `newPassword=${encodeURIComponent(newPassword)}`
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return response.json();
}

export async function getBusinessIDList() {
    const FETCH_URL = `${API_URL}/get-business-id-list`;

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

export async function getEmployeeWorkScheduleException(employeeId, dateString) {
    const FETCH_URL = `${API_URL}/get-employee-work-schedule-exception/${employeeId}?date=${dateString}`;

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

export async function initializeEmployeeWorkScheduleException(employeeWorkScheduleException) {
    const FETCH_URL = `${API_URL}/initialize-employee-work-schedule-exception`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeWorkScheduleException)
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

export async function getServiceBreakRuleList(serviceID) {
    const FETCH_URL = `${API_URL}/get-service-break-rule-list/${serviceID}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function initializeServiceBreakRuleList(serviceID, serviceBreakRuleList) {
    const FETCH_URL = `${API_URL}/initialize-service-break-rule-list/${serviceID}`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            serviceBreakRuleList: serviceBreakRuleList
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}
