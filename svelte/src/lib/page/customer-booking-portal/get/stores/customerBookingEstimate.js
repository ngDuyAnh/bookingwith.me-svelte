import {get, writable} from 'svelte/store';
import {getCustomerBookingEstimate} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
import {now} from "$lib/page/stores/now/now_dayjs_store.js";
import {formatToDate, formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
import dayjs from "dayjs";
import {CustomerBooking, CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
import {ServerEvent} from "$lib/api/api_server/api_endpoints/ws/api.js";

export const customerBooking = writable(
    CustomerBooking()
);

export const customerBookingEstimate = writable({
    queuePosition: -1,
    bookingDateFormatted: undefined,
    bookingTimeFormatted: undefined,
    estimateServicingStartTime: undefined,
    estimateServicingEndTime: undefined
});

export function fetchCustomerBookingEstimate()
{
    const nowValue = get(now);
    const customerBookingValue = get(customerBooking);

    // Assume the customer booking is today, get the estimate
    getCustomerBookingEstimate(customerBookingValue.bookingID, nowValue.format(formatToTime))
        .then(response => {
            customerBookingEstimateUpdate(response);
        })
}

export function customerBookingEstimateUpdate(estimate) {
    console.log(`Handle ${ServerEvent.UPDATE_CUSTOMER_BOOKING_ESTIMATE}`, estimate)

    const customerBookingValue = get(customerBooking);

    // Get the customer booking position
    const queuePosition = findCustomerBookingQueuePosition(customerBookingValue, estimate.appointmentLobbyCustomerBookingList);

    // Get the estimate servicing time
    const estimateServicingTimePeriod = findEstimateServicingTimePeriod(customerBookingValue.bookingID, estimate.schedule.employeeTimetableList);

    // Appointment date and time format for display
    let bookingDateFormatted = dayjs(customerBookingValue.bookingDate, formatToDate).format('ddd, MMM D YYYY');
    let bookingTimeFormatted = dayjs(customerBookingValue.bookingTime, formatToTime).format(formatToTimeAm);

    // Estimate servicing time
    let estimateServicingStartTime = dayjs(estimateServicingTimePeriod.startTime, formatToTime).format(formatToTimeAm);
    let estimateServicingEndTime = dayjs(estimateServicingTimePeriod.endTime, formatToTime).format(formatToTimeAm);

    // Set the information to the store
    customerBookingEstimate.set({
        queuePosition,
        bookingDateFormatted,
        bookingTimeFormatted,
        estimateServicingStartTime,
        estimateServicingEndTime
    });
}

export function handleCustomerBookingEstimateUpdateEvent(eventData) {
    customerBookingEstimateUpdate(eventData.data);
}

function findCustomerBookingQueuePosition(customerBooking, customerBookingList) {
    let position = -1;
    if (customerBooking.bookingState !== CustomerBookingState.SERVICING &&
        customerBooking.bookingState !== CustomerBookingState.COMPLETED) {
        const index = customerBookingList.findIndex(booking => booking.bookingID === customerBooking.bookingID);
        if (index !== -1) {
            position = index + 1;
        }
    }

    // Return
    return position;
}

function findEstimateServicingTimePeriod(bookingID, employeeTimetableList) {
    const matchingTickets = employeeTimetableList.flatMap(timetable =>
        timetable.servicingTicketList.filter(ticket => ticket.bookingID === bookingID)
    );

    if (matchingTickets.length === 0) {
        return { startTime: "23:59", endTime: "23:59" };
    }

    const startTime = matchingTickets.reduce((earliest, ticket) => {
        const ticketStartTime = dayjs(ticket.timePeriod.startTime, formatToTime);
        return !earliest || ticketStartTime.isBefore(earliest) ? ticketStartTime : earliest;
    }, null);

    const endTime = matchingTickets.reduce((latest, ticket) => {
        const ticketEndTime = dayjs(ticket.timePeriod.endTime, formatToTime);
        return !latest || ticketEndTime.isAfter(latest) ? ticketEndTime : latest;
    }, null);

    return { startTime, endTime };
}
