import dayjs from "dayjs";
import {formatToDate, formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
import {
    sendSms,
    scheduleSendSms, cancelScheduledSms
} from "$lib/api/api_twilio/twilio_endpoints/twilio_endpoints.js";
import {get} from "svelte/store";
import {now} from "$lib/page/stores/now/now_dayjs_store.js";

const WEB_PAGE_URL = "https://app.bookingwith.me";

export async function sendSmsConfirmBookingSuccess(businessName, customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;
    let formattedDate = dayjs(customerBooking.bookingDate).format('dddd, MMMM D');
    let formattedTime = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

    // Build the SMS message
    let message = `Your appointment at ${businessName} is set for ${formattedDate} at ${formattedTime}. Check this link for real-time updates on your servicing time: ${customerBookingURL}`;

    return await sendSms(formattedPhoneNumber, message);
}

export async function sendSmsBookingReminder(businessName, customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let formattedTime = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

    // Calculate the number of minutes in the future to send the SMS
    let appointmentDateTime = dayjs(`${customerBooking.bookingDate} ${customerBooking.bookingTime}`, `${formatToDate} ${formatToTime}`);
    let currentDateTime = get(now);

    // Build the SMS message
    let futureMinutes = appointmentDateTime.diff(currentDateTime, 'minute');
    let daysUntilAppointment = appointmentDateTime.startOf('day').diff(currentDateTime.startOf('day'), 'day');
    let message = `Reminder: Your appointment at ${businessName} is set for tomorrow at ${formattedTime}. Please use the booking link for real-time updates on your servicing time. Looking forward to seeing you!`;
    /*
    if (daysUntilAppointment === 1)
    {
        futureMinutes = appointmentDateTime.subtract(1, 'hour').diff(currentDateTime, 'minute');
        message = `Reminder: Your appointment at ${businessName} is in about an hour. Please arrive early for smoother service. Check your booking link for real-time updates. See you soon!`;
    }
    */
    if (daysUntilAppointment < 2)
    {
        return {
            sid: null,
            status: "No SMS reminder sent."
        }
    }

    return await scheduleSendSms(formattedPhoneNumber, message, futureMinutes);
}

export async function sendSMSAskingForReview(businessName, customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;

    // Build the SMS message
    let message = `Thank you for visiting ${businessName}! How did we do today? Please let us know using this link: ${customerBookingURL}`;

    return await scheduleSendSms(formattedPhoneNumber, message, 16);
}

export async function cancelScheduledReminderSms(customerBooking)
{
    return await cancelScheduledSms(customerBooking.reminderSid);
}
