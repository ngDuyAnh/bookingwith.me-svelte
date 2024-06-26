import {get, writable} from 'svelte/store';
import {getCustomerBookingEstimate} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
import {now} from "$lib/page/stores/now/now_dayjs_store.js";
import {formatToTime} from "$lib/application/Formatter.js";

export const customerBooking = writable(undefined);
export const customerBookingEstimate = writable({
    relativeDate: undefined,
    bookingDateFormatted: undefined,
    bookingTimeFormatted: undefined,
    estimateServicingStartTime: undefined,
    estimateServicingEndTime: undefined
});

export function fetchCustomerBookingEstimate()
{
    const nowValue = get(now);

    getCustomerBookingEstimate(data.bookingID, nowValue.format(formatToTime))
}
