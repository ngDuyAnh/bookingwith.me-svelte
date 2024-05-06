const API_URL = "https://bookingwithme-8885-dev.twil.io";

export async function sendText(toPhoneNumber, message)
{
    const FETCH_URL = `${API_URL}/send-sms`;

    const body = new URLSearchParams();

    body.append('to',toPhoneNumber);
    body.append('body',message);


    const response = await fetch(FETCH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    return await response.json();
}
