import {API_BASE_URL} from "$lib/api/api_server/API-URL.js";

const API_URL = `${API_BASE_URL}/lobby-portal`;

export async function getCustomer(phoneNumber)
{
    const FETCH_URL = `${API_URL}/get-customer/${phoneNumber}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getAppointmentBookingList(businessId, dateString)
{
    const FETCH_URL = `${API_URL}/get-appointment-booking-list/${businessId}?date=${dateString}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getLobbyBookingList(businessId, dateString)
{
    const FETCH_URL = `${API_URL}/get-lobby-booking-list/${businessId}?date=${dateString}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getRecentCustomerBooking(businessId, dateString)
{
    const FETCH_URL = `${API_URL}/get-recent-customer-booking/${businessId}?date=${dateString}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function initializeCustomerBooking(customerBooking)
{
    const FETCH_URL = `${API_URL}/initialize-customer-booking`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerBooking)
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch valid access. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getSchedule(businessId, dateString, timeString)
{
    const FETCH_URL = `${API_URL}/get-schedule/${businessId}?date=${dateString}&time=${timeString}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}
