import dayjs from "dayjs";
import {formatToDate} from "$lib/application/Formatter.js";
import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
import {availability} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
import {isPast, isToday, nowTime} from "$lib/page/stores/now/now_dayjs_store.js";
import {getBusinessID} from "$lib/page/stores/business/business.js";
import {sanitizeCustomerBooking} from "$lib/api/utilitiy_functions/CustomerBooking.js";

export function checkAbleToSendSmsReviewReminder(checkAbleToSendresponse) {
    const {allowToSendReviewReminderSMS, mostRecentDateReviewReminderSent} = checkAbleToSendresponse;

    // Check if the most recent send date is more than 6 months ago
    // The customer is new to the business
    const moreThan6Months = mostRecentDateReviewReminderSent
        ? dayjs().diff(dayjs(mostRecentDateReviewReminderSent, formatToDate), 'month') > 6
        : true;

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
