import {get, writable} from 'svelte/store';
import dayjs from 'dayjs';
import {formatToDate} from "$lib/application/Formatter.js";

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

export function isToday(date)
{
    const todayDate = get(now).format(formatToDate);
    return date === todayDate;
}
