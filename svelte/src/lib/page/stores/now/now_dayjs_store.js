import {get, writable} from 'svelte/store';
import dayjs from 'dayjs';
import {formatToDate, formatToTime} from "$lib/application/Formatter.js";

export const now = writable(dayjs());

function updateNow() {
    now.set(dayjs());
}

function getTimeUntilNextMinute() {
    const nowValue = dayjs();
    const nextMinute = nowValue.add(1, 'minute').startOf('minute');
    return nextMinute.diff(nowValue);
}

// Update the `now` store
setTimeout(() => {
    updateNow();
    // Set interval to update `now` every minute
    setInterval(updateNow, 60000);
}, getTimeUntilNextMinute());

// For testing purposes to set the now time to a fixed time
//export const now = writable(dayjs('2024-05-08T17:30'));

export function today()
{
    const nowValue = get(now);
    return nowValue.format(formatToDate);
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
