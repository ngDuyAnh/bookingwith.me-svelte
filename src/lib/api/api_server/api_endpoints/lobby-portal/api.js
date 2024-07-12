import {API_BASE_URL} from "$lib/api/api_server/API-URL.js";

const API_URL = `${API_BASE_URL}/lobby-portal`;

export async function getAppointmentBookingList(businessID, dateString)
{
    const FETCH_URL = `${API_URL}/get-appointment-booking-list/${businessID}?date=${dateString}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getCustomerBookingQueueList(businessID, dateString)
{
    const FETCH_URL = `${API_URL}/get-customer-booking-queue-list/${businessID}?date=${dateString}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function getSchedule(businessID, dateString, timeString)
{
    const FETCH_URL = `${API_URL}/get-schedule/${businessID}?date=${dateString}&time=${timeString}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function checkAbleToSendReviewReminder(customerBooking)
{
    const FETCH_URL = `${API_URL}/able-to-send-sms-review-reminder/${customerBooking.bookingID}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function checkAbleToSendReviewReminderPhoneNumber(businessID, phoneNumber)
{
    const FETCH_URL = `${API_URL}/able-to-send-sms-review-reminder-phone-number/${businessID}?phoneNumber=${phoneNumber}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}
