import dayjs from "dayjs";
import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
import {
    cancelScheduledMessage,
    sendConfirmation,
    sendScheduledReminder,
    sendScheduledReview
} from "$lib/api/api_twilio/twilio_endpoints/twilio_endpoints.js";

const WEB_PAGE_URL = "https://app.bookingwith.me";

export async function send_SMS_BookingSuccess(businessName, customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;
    let formattedDate = dayjs(customerBooking.bookingDate).format('dddd, MMMM D');
    let formattedTime = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

    // Build the SMS message
    let message = `Your appointment at ${businessName} is set for ${formattedDate} at ${formattedTime}. Check this link for real-time updates on your servicing time: ${customerBookingURL}`;

    const response = await sendConfirmation(formattedPhoneNumber, message);
    // const response2 = await sendScheduledReminder(formattedPhoneNumber, message);
    // const response3= await cancelScheduledMessage("SMb4933aabbc6f004430d5d487f11a79e6");

    console.log("sendConfirmation Response is", response);
    console.log("sendConfirmation status is", response.status);
}

export async function send_SMS_ReviewReminder(businessName, customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;

    // Build the SMS message
    let message = `Thank you for visiting ${businessName}! How did we do today? Please let us know using this link: ${customerBookingURL}`;

    const response = await sendScheduledReview(formattedPhoneNumber, message);

    console.log("sendConfirmation Response is", response);
    console.log("sendConfirmation status is", response.status);
}

//not done, prob anh doing it in backend or something
export async function send_SMS_BookingReminder(customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;

    // Build the SMS message
    let message = `If you would like to share your experience, make sure to leave a review! ${customerBookingURL}`;

    const response = await sendScheduledReview(formattedPhoneNumber, message);

    console.log("sendConfirmation Response is", response);
    console.log("sendConfirmation status is", response.status);
}