import {initializeCustomerBookingAndBroadcast} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
import {nowTime} from "$lib/page/stores/business/business.js";

export async function setCustomerBookingArrivalStatus(customerBooking, arrivalStatus)
{
    customerBooking.arrivalStatus = arrivalStatus;

    // Save the customer booking change
    await initializeCustomerBookingAndBroadcast(customerBooking, nowTime());
}
