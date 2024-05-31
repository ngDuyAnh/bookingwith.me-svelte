import dayjs from "dayjs";
import {formatToDate, formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
import {
    sendSms,
    scheduleSendSms, cancelScheduledSms
} from "$lib/api/api_twilio/twilio_endpoints/twilio_endpoints.js";
import {get} from "svelte/store";
import {now} from "$lib/page/stores/now/now_dayjs_store.js";

const WEB_PAGE_URL = "https://app.bookingwith.me";

export function sendSmsConfirmBookingSuccess(businessName, customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;
    let formattedDate = dayjs(customerBooking.bookingDate).format('dddd, MMMM D');
    let formattedTime = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

    // Build the SMS message
    let message = `Your appointment at ${businessName} is set for ${formattedDate} at ${formattedTime}. Check this link for real-time updates on your servicing time: ${customerBookingURL}`;

    sendSms(formattedPhoneNumber, message)
        .then(() => {
            console.log('Sent SMS appointment confirmation.');
        })
        .catch(error => {
            console.error('Error sending SMS appointment confirmation:', error);
        });
}

export async function sendSmsBookingReminder(businessName, customerBooking)
{
    // Cancel the current scheduled sms if they have one
    cancelScheduledReminderSms(customerBooking);

    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let formattedTime = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

    // Calculate the number of minutes in the future to send the SMS
    let appointmentDateTime = dayjs(`${customerBooking.bookingDate} ${customerBooking.bookingTime}`, `${formatToDate} ${formatToTime}`);
    let currentDateTime = get(now);
    let reminderDateTime = appointmentDateTime.subtract(1, 'day');

    // Build the SMS message
    let message = `Reminder: Your appointment at ${businessName} is set for tomorrow at ${formattedTime}. Please use the booking link for real-time updates on your servicing time. Looking forward to seeing you!`;
    let daysUntilAppointment = appointmentDateTime.startOf('day').diff(currentDateTime.startOf('day'), 'day');
    let futureMinutes = reminderDateTime.diff(currentDateTime, 'minute');

    // Reminder the day before
    if (daysUntilAppointment < 2)
    {
        return {
            sid: null,
            status: "No SMS reminder sent."
        }
    }

    //console.log(`daysUntilAppointment ${daysUntilAppointment}, futureMinutes ${futureMinutes}`)

    return await scheduleSendSms(formattedPhoneNumber, message, futureMinutes);
}

export function sendSMSAskingForReview(businessName, customerBooking)
{
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${WEB_PAGE_URL}/customer-booking-portal/get/${customerBooking.bookingID}`;

    // Build the SMS message
    let message = `Thank you for visiting ${businessName}! How did we do today? Please let us know using this link: ${customerBookingURL}`;

    scheduleSendSms(formattedPhoneNumber, message, 16)
        .then(() => {
            console.log('Review reminder sent.');
        })
        .catch(error => {
            console.error('Error sending review reminder:', error);
        });
}

export function cancelScheduledReminderSms(customerBooking)
{
    // Cancel the current scheduled
    if (customerBooking && customerBooking.reminderSid)
    {
        cancelScheduledSms(customerBooking.reminderSid)
            .then(() => {
                console.log('Scheduled reminder SMS successfully cancelled.');
                customerBooking.reminderSid = null;
            })
            .catch(error => {
                console.error('Error cancelling scheduled reminder SMS:', error);
            });
    }
}
