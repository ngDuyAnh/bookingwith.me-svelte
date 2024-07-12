import {TWILIO_API_URL} from "$lib/api/api_twilio/twilio_endpoints/TWILIO-API-URL.js";

export async function sendSms(formattedPhoneNumber, message)
{
    const FETCH_URL = `${TWILIO_API_URL}/sms/send/send-sms`;

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: formattedPhoneNumber,
            message: message
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to send SMS. Status: ${response.status}`);
    }

    return await response.json();
}

export async function scheduleSendSms(toPhoneNumber, message, futureMinutes)
{
    const FETCH_URL = `${TWILIO_API_URL}/sms/send/schedule-send-sms`;

    // Twilio expect min of 15 minutes and max of 35 days
    // Enforce the limits
    const MIN_MINUTES = 15 + 1;
    const MAX_MINUTES = (35 - 4) * 24 * 60;
    if (futureMinutes < MIN_MINUTES)
    {
        futureMinutes = MIN_MINUTES;
    }
    else if (futureMinutes > MAX_MINUTES)
    {
        throw new Error(`futureMinutes exceeds the maximum allowed limit of ${MAX_MINUTES} minutes.`);
    }

    const response = await fetch(`${FETCH_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: toPhoneNumber,
            message: message,
            futureMinutes: futureMinutes
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to schedule send SMS. Status: ${response.status}`);
    }

    return await response.json();
}

export async function cancelScheduledSms(sid)
{
    const FETCH_URL = `${TWILIO_API_URL}/sms/cancel/cancel-scheduled-sms`;

    const response = await fetch(FETCH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sid: sid
        })
    });

    if (!response.ok) {
        throw new Error(`Failed cancel schedule sms. Status: ${response.status}`);
    }

    return await response.json();
}
