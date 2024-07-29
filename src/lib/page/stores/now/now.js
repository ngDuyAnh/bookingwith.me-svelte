import dayjs from 'dayjs';
import {derived, get} from "svelte/store";
import {business} from "$lib/page/stores/business/business.js";
import {formatToDate, formatToTime} from "$lib/application/Formatter.js";

export const now = derived(business, ($business, set) => {

    // Initialize based on the business timezone
    // Use local timezone as alternative
    if ($business?.businessInfo.timezone) {
        // console.log(`Business timezone is ${$business.businessInfo.timezone}.`);
        set(dayjs().tz($business.businessInfo.timezone));
    } else {
        // console.log("Now time store is local timezone.")
        set(dayjs()); // Default to local time zone if business time zone is not available
    }

    // For testing purposes to set the now time to a fixed time
    //export const now = writable(dayjs('2024-05-08T17:30'));

    // Function to update the now store every minute
    function updateNow() {
        if ($business && $business.businessInfo && $business.businessInfo.timezone) {
            set(dayjs().tz($business.businessInfo.timezone));
        } else {
            set(dayjs());
        }
    }

    // Calculates the time until the next minute starts
    function getTimeUntilNextMinute() {
        const nowValue = $business && $business.businessInfo && $business.businessInfo.timezone ?
            dayjs().tz($business.businessInfo.timezone) : dayjs();
        const nextMinute = nowValue.add(1, 'minute').startOf('minute');
        return nextMinute.diff(nowValue);
    }

    const timeout = setTimeout(updateNow, getTimeUntilNextMinute());
    const interval = setInterval(updateNow, 60000);

    // Cleanup function when the store is unsubscribed or business info changes
    return () => {
        clearTimeout(timeout);
        clearInterval(interval);
    };
});

export function today()
{
    const nowValue = get(now);
    return nowValue.format(formatToDate);
}

export function tomorrow()
{
    const nowValue = get(now);
    return nowValue.startOf('day').add(1, 'day').format(formatToDate);
}

export function nowTime()
{
    const nowValue = get(now);
    return nowValue.format(formatToTime);
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
