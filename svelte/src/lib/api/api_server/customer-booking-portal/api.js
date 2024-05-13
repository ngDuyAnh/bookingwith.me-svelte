import {API_BASE_URL} from "$lib/api/api_server/API-URL.js";

const API_URL = `${API_BASE_URL}/customer-booking-portal`;

export async function availability(id, dateString, currentTimeString, customerIndividualList)
{
    const FETCH_URL = `${API_URL}/availability/${id}`;

    // Convert guestList to the appropriate format
    const availableBooking = {
        date: dateString,
        currentTime: currentTimeString,
        customerIndividualList: customerIndividualList
    };

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
            body: JSON.stringify(availableBooking)
    });

    if (!response.ok) {
        const errorBody = await response.text(); // or response.json() if the server responds with JSON
        throw new Error(`availableBooking(). Status: ${response.status}, Body: ${errorBody}`);
    }

    return await response.json();
}

export async function walkin_availability(id, dateString, currentTimeString, customerIndividualList)
{
    const FETCH_URL = `${API_URL}/walk-in-availability/${id}`;

    // Convert guestList to the appropriate format
    const availableBooking = {
        availableBooking: {
            date: dateString,
            currentTime: currentTimeString,
            customerIndividualList: customerIndividualList
        }
    };

    console.log("availableBooking", JSON.stringify(availableBooking))

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(availableBooking)
    });

    if (!response.ok) {
        const errorBody = await response.text(); // or response.json() if the server responds with JSON
        throw new Error(`walk_in_availability(). Status: ${response.status}, Body: ${errorBody}`);
    }

    return await response.json();
}

export async function submitBooking(id, currentTime, timePeriod, customerBooking, timestamp, customerIndividualList)
{
    const FETCH_URL = `${API_URL}/submit-booking/${id}`;

    // Convert guestList to the appropriate format
    const submitBooking = {
        "currentTime": currentTime,
        "timePeriod": timePeriod,
        "customerBooking": customerBooking,
        "timestamp": timestamp,
        "customerIndividualList": customerIndividualList
    };

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitBooking)
    });

    if (!response.ok) {
        const errorBody = await response.text(); // or response.json() if the server responds with JSON
        throw new Error(`Failed to create business. Status: ${response.status}, Body: ${errorBody}`);
    }

    return await response.json();
}

export async function forceSubmitBooking(id, customerBooking, timestamp, customerIndividualList)
{
    const FETCH_URL = `${API_URL}/force-submit-booking/${id}`;

    // Convert guestList to the appropriate format
    const submitBooking = {
        "customerBooking": customerBooking,
        "timestamp": timestamp,
        "customerIndividualList": customerIndividualList
    };

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitBooking)
    });

    if (!response.ok) {
        const errorBody = await response.text(); // or response.json() if the server responds with JSON
        throw new Error(`Failed to create business. Status: ${response.status}, Body: ${errorBody}`);
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

export async function deleteBooking(id)
{
    const FETCH_URL = `${API_URL}/delete-customer-booking?id=${id}`;

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
        throw new Error(`Failed to fetch available bookings. Status: ${response.status}`);
    }

    return await response.json();
}
