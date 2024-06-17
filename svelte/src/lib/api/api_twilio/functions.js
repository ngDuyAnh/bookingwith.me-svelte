import dayjs from "dayjs";
import {formatToDate, formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
import {
    sendSms,
    scheduleSendSms, cancelScheduledSms
} from "$lib/api/api_twilio/twilio_endpoints/twilio_endpoints.js";
import {get} from "svelte/store";
import {now} from "$lib/page/stores/now/now_dayjs_store.js";

const WEB_PAGE_URL = "https://app.bookingwith.me";

export async function sendSmsConfirmBookingSuccess(businessName, customerBooking) {
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;
    let formattedDate = dayjs(customerBooking.bookingDate).format('dddd, MMMM D');
    let formattedTime = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

    // Build the SMS message
    let message = `Please click the link to confirm your appointment! Your appointment at ${businessName} is set for ${formattedDate} at ${formattedTime}: ${customerBookingURL}`;

    // Send the SMS
    return await sendSms(formattedPhoneNumber, message);
}

export async function sendSmsBookingReminder(businessName, customerBooking) {
    // Cancel the current scheduled sms if they have one
    try {
        await cancelScheduledReminderSms(customerBooking);

        // Removed the reminder
        customerBooking.smsAppointmentReminderSid = null;
    } catch (error) {
        console.error('Error cancelling scheduled reminder SMS:', error);
    }

    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let formattedTime = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

    // Calculate the number of minutes in the future to send the SMS
    let appointmentDateTime = dayjs(`${customerBooking.bookingDate} ${customerBooking.bookingTime}`, `${formatToDate} ${formatToTime}`);
    let currentDateTime = get(now);
    let reminderDateTime = appointmentDateTime.subtract(1, 'day');

    // Build the SMS message
    let message = `Reminder: Your appointment at ${businessName} is set for tomorrow at ${formattedTime}. PLEASE USE THE BOOKING LINK for updates on your servicing time. Looking forward to seeing you!`;
    let daysUntilAppointment = appointmentDateTime.startOf('day').diff(currentDateTime.startOf('day'), 'day');
    let futureMinutes = reminderDateTime.diff(currentDateTime, 'minute');

    // Reminder the day before
    if (daysUntilAppointment < 2) {
        return {
            sid: null,
            status: "No SMS reminder sent."
        }
    }

    //console.log(`daysUntilAppointment ${daysUntilAppointment}, futureMinutes ${futureMinutes}`)

    return await scheduleSendSms(formattedPhoneNumber, message, futureMinutes);
}

export async function sendSmsAppointment(businessName, customerBooking) {
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Build the SMS message
    let message = `Hi, we are almost ready for you. Please come to ${businessName}. See you soon!`;

    // Send the SMS
    return await sendSms(formattedPhoneNumber, message);
}

export async function sendSMSAskingForReview(businessName, customerBooking) {
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;

    // Build the SMS message
    let message = `Thank you for visiting ${businessName}! How did we do today? Please let us know using this link: ${customerBookingURL}`;

    // Ensure to only send review reminder one time
    if (customerBooking.smsReviewReminderSent) {
        throw new Error('Review reminder has already been sent');
    }

    return scheduleSendSms(formattedPhoneNumber, message, 16);
}

export function cancelScheduledReminderSms(customerBooking) {
    // Cancel the current scheduled
    if (customerBooking && customerBooking.smsAppointmentReminderSid) {
        return cancelScheduledSms(customerBooking.smsAppointmentReminderSid)
    } else {
        throw new Error('There is no scheduled reminder SMS to cancel.');
    }
}
