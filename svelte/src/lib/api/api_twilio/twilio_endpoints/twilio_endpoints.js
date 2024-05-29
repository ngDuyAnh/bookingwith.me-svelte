const API_URL = "https://bookingwithme-8394-dev.twil.io";

async function fetchInit(endPoint, toPhoneNumber, message) {
    const FETCH_URL = `${API_URL}${endPoint}`;

    const body = new URLSearchParams();

    body.append('to', toPhoneNumber);
    body.append('body', message);

    return await fetch(FETCH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
    });
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

export async function sendScheduledReminder(toPhoneNumber, message) {

    const FETCH_URL = `${API_URL}/bookingReminder/send-reminder`;

    const body = new URLSearchParams();

    body.append('to', toPhoneNumber);
    body.append('body', message);
    body.append('futureMinutes', 16);

    const response = await fetch(FETCH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}



//update reminder calls to be proper


export async function cancelScheduledMessage(sid) {

    const FETCH_URL = `${API_URL}/cancelScheduled/cancel-scheduled-sms`;

    const body = new URLSearchParams();

    body.append('sid', sid);

    const response = await fetch(FETCH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}