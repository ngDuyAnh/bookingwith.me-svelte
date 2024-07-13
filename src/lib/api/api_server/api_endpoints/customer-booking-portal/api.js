import {PUBLIC_API_BASE_URL} from "$env/static/public";
import {cancelScheduledReminderSms} from "$lib/api/api_twilio/functions.js";

const API_URL = `${PUBLIC_API_BASE_URL}/customer-booking-portal`;

export async function availability(id, dateString, currentTimeString, customerBooking, timeSlot) {
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

export async function submitBooking(id, currentTimeString, timePeriod, customerBooking) {
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

export async function forceSubmitBooking(id, currentTimeString, customerBooking) {
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

export async function initializeCustomerBookingAndBroadcast(customerBooking, timeString) {
    const FETCH_URL = `${API_URL}/initialize-customer-booking-and-broadcast?date=${customerBooking.bookingDate}&time=${timeString}`;

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

export async function initializeCustomerBooking(customerBooking) {
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

export async function getCustomerBooking(bookingid) {
    const FETCH_URL = `${API_URL}/get-customer-booking?bookingid=${bookingid}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function initializeCustomerProfile(businessID, customerProfile) {
    const FETCH_URL = `${API_URL}/initialize-customer-profile/${businessID}`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerProfile)
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getCustomerProfile(businessID, phoneNumber)
{
    const FETCH_URL = `${API_URL}/get-customer-profile/${businessID}?phoneNumber=${phoneNumber}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getBusinessFromCustomerBooking(bookingid) {
    const FETCH_URL = `${API_URL}/get-business-from-customer-booking?bookingid=${bookingid}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getCustomerBookingEstimate(bookingID, currentTime) {
    const FETCH_URL = `${API_URL}/get-customer-booking-estimate/${bookingID}?time=${currentTime}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function deleteCustomerBooking(businessID, customerBooking) {
    // Remove the scheduled sms appointment reminder
    try {
        await cancelScheduledReminderSms(customerBooking);
        console.log('Scheduled reminder SMS successfully cancelled.');

        // Removed the reminder
        customerBooking.smsAppointmentReminderSid = null;
    } catch (error) {
        console.error('Failed to cancel scheduled reminder SMS:', error);
    }

    // Delete the customer booking
    const FETCH_URL = `${API_URL}/delete-customer-booking/${businessID}`;

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

export async function getCustomer(businessID, phoneNumber)
{
    const FETCH_URL = `${API_URL}/get-customer/${businessID}?phoneNumber=${phoneNumber}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getBusiness(id) {
    const FETCH_URL = `${API_URL}/get-business/${id}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getAppointmentLobbyCustomerBookingList(businessID, dateString)
{
    const FETCH_URL = `${API_URL}/get-appointment-lobby-customer-booking-list/${businessID}?date=${dateString}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}
