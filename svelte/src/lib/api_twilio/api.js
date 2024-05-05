const API_URL = "https://bookingwithme-8174-dev.twil.io";

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

export async function sendTextBookingSuccess(customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.phoneNumber;

    // Create the message
    let message = `Success booking ${customerBooking}`;

    // Send text
    console.log(sendText(formattedPhoneNumber, message));
}
