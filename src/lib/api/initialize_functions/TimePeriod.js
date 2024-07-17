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
