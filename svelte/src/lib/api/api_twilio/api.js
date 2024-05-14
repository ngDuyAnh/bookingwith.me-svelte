import dayjs from "dayjs";
import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
import {sendText} from "$lib/api/api_twilio/twilio_endpoints/twilio_endpoints.js";
import {WEB_PAGE_URL} from "$lib/WEB_PAGE_URL.js";

export async function sendTextBookingSuccess(businessName, customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;
    let formattedDate = dayjs(customerBooking.bookingDate).format('dddd, MMMM D');
    let formattedTime = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

    // Build the SMS message
    let message = `Your appointment at ${businessName} is set for ${formattedDate} at ${formattedTime}. Check this link for real-time updates on your service time: ${customerBookingURL}`;

    // Send text
    console.log(sendText(formattedPhoneNumber, message));
}
