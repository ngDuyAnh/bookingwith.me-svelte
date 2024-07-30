import dayjs from "dayjs";
import {formatToDate} from "$lib/application/Formatter.js";
import {CustomerBookingState, WalkInCustomer} from "$lib/api/initialize_functions/CustomerBooking.js";
import {
    availability,
    forceSubmitBooking, initializeCustomerBooking,
    submitBooking
} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
import {isPast, isToday, nowTime} from "$lib/page/stores/now/now.js";
import {getBusinessID} from "$lib/page/stores/business/business.js";
import {sanitizeCustomerBooking} from "$lib/api/utilitiy_functions/CustomerBooking.js";
import {
    moveToAppointment,
    moveToLobby
} from "$lib/components/Modal/CustomerBookingClickModal/handle_customer_booking_state.js";
import {
    sendSmsBookingReminder,
    sendSmsConfirmBookingSuccess, sendSmsEditBookedEmployee,
    sendSmsNewBookedEmployee
} from "$lib/api/api_twilio/functions.js";
import {get} from 'svelte/store';
import {business} from "$lib/page/stores/business/business.js";

export function checkAbleToSendSmsReviewReminder(checkAbleToSendresponse) {
    const {allowToSendReviewReminderSMS, mostRecentDateReviewReminderSent} = checkAbleToSendresponse;

    // Check if the most recent send date is more than 6 months ago
    // The customer is new to the business
    const moreThan6Months = mostRecentDateReviewReminderSent
        ? dayjs().diff(dayjs(mostRecentDateReviewReminderSent, formatToDate), 'month') > 6
        : true;

    // console.log(`allowToSendReviewReminderSMS ${allowToSendReviewReminderSMS} mostRecentDateReviewReminderSent ${mostRecentDateReviewReminderSent} moreThan6Months ${moreThan6Months}`)

    // Return
    return allowToSendReviewReminderSMS && moreThan6Months;
}

export async function fetchAvailableTimeList(customerBooking, isWalkIn) {
    // Booking time
    let currentTimeString = "00:00"; // Booking date is in the future
    if (isToday(customerBooking.bookingDate)) {
        currentTimeString = nowTime();
    }
    // Invalid, the date selected is before today
    // Set it to the end of the day for no availability
    else if (isPast(customerBooking.bookingDate)) {
        currentTimeString = "23:59";
    }

    // Cloned
    const clonedCustomerBooking = sanitizeCustomerBooking(
        JSON.parse(JSON.stringify(customerBooking))
    );

    // Set the customer booking state for walk-in or same time schedule
    if (isWalkIn) {
        clonedCustomerBooking.bookingState = CustomerBookingState.APPOINTMENT;
    } else {
        clonedCustomerBooking.bookingState = CustomerBookingState.SCHEDULE;
    }

    // Get the availabilities
    const {availabilityList} = await availability(
        getBusinessID(),
        clonedCustomerBooking.bookingDate,
        currentTimeString,
        clonedCustomerBooking,
        5
    );

    // Return
    return availabilityList;
}

export async function submitCustomerBooking(
    cb,
    bookingDate, currentTimeString, bookingTime, bookingTimePeriod,
    walkinAvailabilityFlag,
    customerBookingInformationProps) {

    const businessValue = get(business);

    let success = false;

    try {
        // Cloned
        const customerBooking = sanitizeCustomerBooking(
            JSON.parse(JSON.stringify(cb))
        );

        // If the customer phone number is empty
        // Then initialize with default walk-in customer profile
        customerBooking.customer = WalkInCustomer();

        // Set the booking date and time for submit
        customerBooking.bookingDate = bookingDate;
        customerBooking.bookingTime = bookingTime;

        // Keep the current booking state if it is not in schedule state
        if (customerBooking.bookingState === CustomerBookingState.SCHEDULE) {
            customerBooking.bookingState = CustomerBookingState.APPOINTMENT;
        }

        // Default the walk-in flag to false
        // The backend will check and handle on creating the customer booking
        customerBooking.walkIn = false;

        // Force submit if override is toggled
        let response = {};
        if (customerBookingInformationProps.overrideFlag) {
            response = await forceSubmitBooking(
                businessValue.businessInfo.businessID,
                currentTimeString,
                customerBooking
            );
        }
        // Submit appointment
        else {
            // Asynchronous servicing
            if (walkinAvailabilityFlag) {
                customerBooking.walkIn = true;
            }

            response = await submitBooking(
                businessValue.businessInfo.businessID,
                currentTimeString,
                bookingTimePeriod,
                customerBooking
            );
        }

        // Success
        if (response.submitted) {
            success = true;

            // Handle SMS and moving the customer booking to lobby
            await handleCustomerBooking(
                businessValue,
                response.customerBooking,
                customerBookingInformationProps,
                (customerBooking.id === -1)
            );
            console.log("Done handling SMS and booking state move.");
        } else {
            await fetchAvailableTimeList();
        }
    } catch (err) {
        console.error("Error submitting booking:", err);
    }

    // Return
    return success;
}

async function handleCustomerBooking(
    businessValue,
    customerBooking,
    customerBookingInformationProps,
    isNewCustomerBooking)
{
    // Send SMS
    if (customerBookingInformationProps.sendSmsFlag) {
        try {
            // Send SMS confirmation for the appointment
            await sendSmsConfirmBookingSuccess(
                businessValue.businessInfo.businessName, customerBooking
            );
            customerBooking.smsConfirmationSent = true;
            console.log('Sent SMS appointment confirmation.');

            // Schedule SMS for reminder for the appointment
            try
            {
                const scheduledReminderResponse = await sendSmsBookingReminder(
                    businessValue.businessInfo.businessName,
                    customerBooking);
                customerBooking.smsAppointmentReminderSid = scheduledReminderResponse.sid;
                console.log('Scheduled a SMS reminder for the appointment.');
            }
            catch(error)
            {
                console.error('Error sending SMS appointment confirmation:', error);
            }

            // Save to the database
            try
            {
                await initializeCustomerBooking(customerBooking);
                console.log('Recorded the SMS sending to the database.');
            }
            catch(error)
            {
                console.error('Error recording the SMS sending to the database:', error);
            }
        } catch (error) {
            console.error('Failed to send appointment confirmation:', error);
        }
    }

    // Send the SMS notification for the employee
    // New customer booking
    if (isNewCustomerBooking)
    {
        await sendSmsNewBookedEmployee(
            businessValue.businessInfo.businessName, customerBooking
        );
        console.log("New customer booking SMS notification to the employees.");
    }
    // Edit customer booking
    else
    {
        await sendSmsEditBookedEmployee(
            businessValue.businessInfo.businessName, customerBooking
        );
        console.log("Edit customer booking SMS notification to the employees.");
    }

    // Move the customer booking state
    if (isToday(customerBooking.bookingDate)) {
        if (customerBookingInformationProps.lobbyBookingStateFlag) {
            await moveToLobby(customerBooking);
            console.log("Moved the customer booking to lobby.");
        } else if (customerBookingInformationProps.appointmentBookingStateFlag) {
            await moveToAppointment(customerBooking);
            console.log("Moved the customer booking to appointment.");
        }
    }
}
