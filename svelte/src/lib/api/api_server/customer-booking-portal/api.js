import {API_BASE_URL} from "$lib/api/api_server/API-URL.js";

const API_URL = `${API_BASE_URL}/customer-booking-portal`;

export async function availability(id, dateString, currentTimeString, customerBooking, timeSlot)
{
    const FETCH_URL = `${API_URL}/availability/${id}?time=${currentTimeString}&slot=${timeSlot}`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerBooking)
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function submitBooking(id, currentTimeString, timePeriod, customerBooking)
{
    const FETCH_URL = `${API_URL}/submit-booking/${id}?time=${currentTimeString}`;

    // Convert guestList to the appropriate format
    const submitBooking = {
        "timePeriod": timePeriod,
        "customerBooking": customerBooking,
    };

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitBooking)
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function forceSubmitBooking(id, currentTimeString, customerBooking)
{
    const FETCH_URL = `${API_URL}/force-submit-booking/${id}?time=${currentTimeString}`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerBooking)
    });

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
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getCustomerBooking(bookingid)
{
    const FETCH_URL = `${API_URL}/get-customer-booking?bookingid=${bookingid}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getCustomerBookingEstimate(bookingID, currentTime)
{
    const FETCH_URL = `${API_URL}/get-customer-booking-estimate/${bookingID}?time=${currentTime}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function deleteBooking(businessID, id)
{
    const FETCH_URL = `${API_URL}/delete-customer-booking/${businessID}?id=${id}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getBusiness(id)
{
    const FETCH_URL = `${API_URL}/get-business/${id}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}
