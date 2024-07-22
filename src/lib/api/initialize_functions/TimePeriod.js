import dayjs from "dayjs";
import {formatToTime} from "$lib/application/Formatter.js";

export function TimePeriod()
{
    return {
        startTime: "00:00",
        endTime: "00:00",
    };
}

export function getEndTime(startTimeString, duration)
{
    // Add the duration to get the end time
    const endTime =
        dayjs(startTimeString, formatToTime).add(duration, 'minute');

    // Return the end time string
    return endTime.format(formatToTime);
}

export function getDurationInMinutes(timePeriod) {

    let duration = 0;
    if (timePeriod && timePeriod.startTime && timePeriod.endTime)
    {
        // Parse the start and end times using dayjs
        const startTime = dayjs(timePeriod.startTime, formatToTime);
        const endTime = dayjs(timePeriod.endTime, formatToTime);
        duration = endTime.diff(startTime, 'minute');
    }

    // Return
    return duration;
}
