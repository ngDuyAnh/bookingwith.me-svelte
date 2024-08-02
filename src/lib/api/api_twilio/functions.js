import dayjs from "dayjs";
import {formatToDate, formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
import {
    sendSms,
    scheduleSendSms, cancelScheduledSms
} from "$lib/api/api_twilio/twilio_endpoints/twilio_endpoints.js";
import {get} from "svelte/store";
import {now, isToday} from "$lib/page/stores/business/business.js";
import {
    getServiceBookingListWithBookedEmployeeFromCustomerBooking,
    groupServiceBookingsByEmployee, shortCustomerBookingID
} from "$lib/api/utility_functions/CustomerBooking.js";
import {PUBLIC_ORIGIN} from "$env/static/public";

export async function sendSmsConfirmBookingSuccess(businessName, customerBooking) {
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${PUBLIC_ORIGIN}/customer-booking-portal/get/${customerBooking.bookingID}`;
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

export async function sendSmsLobby(businessName, customerBooking) {
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Build the SMS message
    let message = `Hi, we are ready for you at ${businessName}.`;

    // Send the SMS
    return await sendSms(formattedPhoneNumber, message);
}

export async function sendSMSAskingForReview(businessName, customerBooking) {
    // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
    let formattedPhoneNumber = "+1" + customerBooking.customer.phoneNumber;

    // Information for the message
    let customerBookingURL = `${PUBLIC_ORIGIN}/customer-booking-portal/get/${customerBooking.bookingID}`;

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
    }
}

export async function sendSmsNewBookedEmployee(businessName, customerBooking) {
    return sendSmsToBookedEmployees(businessName, customerBooking, 'New');
}

export async function sendSmsEditBookedEmployee(businessName, customerBooking) {
    return sendSmsToBookedEmployees(businessName, customerBooking, 'Edit');
}

async function sendSmsToBookedEmployees(businessName, customerBooking, actionType) {
    // Get the service booking list with booked employee
    let serviceBookingWithBookedEmployeeList = getServiceBookingListWithBookedEmployeeFromCustomerBooking(customerBooking);

    // Group the service bookings by employee
    let groupedServiceBookings = groupServiceBookingsByEmployee(serviceBookingWithBookedEmployeeList);

    // Message information
    let formattedDate = dayjs(customerBooking.bookingDate).format('dddd, MMMM D');
    let formattedTime = dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm);

    // Iterate over each employee and send the SMS notification
    for (let employeeId in groupedServiceBookings) {
        if (Object.hasOwnProperty.call(groupedServiceBookings, employeeId)) {
            let employeeBookings = groupedServiceBookings[employeeId];

            // Get the employee phone number
            let bookedEmployee = employeeBookings[0].bookedEmployee;
            let employeePhoneNumber = bookedEmployee.phoneNumber;

            // Create and send the service booking notification to the employee
            if (employeePhoneNumber) {
                // https://help.twilio.com/articles/223183008-Formatting-International-Phone-Numbers
                let formattedPhoneNumber = "+1" + employeePhoneNumber;

                // Create the message
                let message = `${businessName}: ${actionType} booking.\n`;
                message += `${isToday(customerBooking.bookingDate) ? "Today" : formattedDate}\n`;
                message += `At ${formattedTime}\n`;
                message += `By (${customerBooking.customer.customerName}) (${shortCustomerBookingID(customerBooking.id)})\n`;
                employeeBookings.forEach((serviceBooking, index) => {
                    message += ` ${index + 1}. ${serviceBooking.service.serviceName}\n`;
                });

                // Send the SMS
                await sendSms(formattedPhoneNumber, message);
                console.log(`Sent SMS notification to employee ${bookedEmployee.employeeName}`);
            }
        }
    }
}
