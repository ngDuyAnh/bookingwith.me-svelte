const API_URL = "https://bookingwithme-4860-dev.twil.io";

async function fetchInit(endPoint, toPhoneNumber, message) {
    const FETCH_URL = `${API_URL}/${endPoint}`;

    const body = new URLSearchParams();

    body.append('to', toPhoneNumber);
    body.append('body', message);

    const response = await fetch(FETCH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
    });

    return response;
}

export async function sendConfirmation(toPhoneNumber, message) {
    const response = await fetchInit(`/bookingConfirmation/send-confirmation`, toPhoneNumber, message);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function sendScheduledReview(toPhoneNumber, message) {

    const response = await fetchInit(`/bookingReview/send-review`, toPhoneNumber, message);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

//update reminder calls to be proper
export async function sendScheduledReminder(toPhoneNumber, message) {

    const response = await fetchInit(`/bookingReminder/send-reminder`, toPhoneNumber, message);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}

export async function cancelScheduledReminder(toPhoneNumber, message) {

    const response = await fetchInit(`/bookingReminder/cancel-reminder`, toPhoneNumber, message);

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}