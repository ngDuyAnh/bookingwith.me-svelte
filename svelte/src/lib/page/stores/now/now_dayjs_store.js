import {get, writable} from 'svelte/store';
import dayjs from 'dayjs';
import {formatToDate} from "$lib/application/Formatter.js";
import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";

export const now = writable(dayjs());

// Update the `now` store
setInterval(() => {
    now.set(dayjs());
}, 30000);

// For testing purposes to set the now time to a fixed time
//export const now = writable(dayjs('2024-05-08T17:30'));

export function today()
{
    const nowValue = get(now);
    return nowValue.format(formatToDate);
}

export function isToday(dateString)
{
    const todayDate = get(now).format(formatToDate);
    return dateString === todayDate;
}

export function isTomorrow(dateString)
{
    const todayDate = get(now);
    return dayjs(dateString, formatToDate).isSame(todayDate.add(1, 'day'), 'day');
}

export function isPast(dateString) {
    const nowValue = get(now);
    return dayjs(dateString, formatToDate).isBefore(nowValue, 'day');
}
