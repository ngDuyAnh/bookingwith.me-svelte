import dayjs from "dayjs";

export const formatToDate = "YYYY-MM-DD";
export const formatToTime = "HH:mm";
export const formatToTimeAM = "hh:mm a";
export const formatToTimeAm = "h:mm a";
export const formatToYearMonth = "YYYY-MM";

export function formatTimeWithoutSeconds(timeString) {
    return dayjs(timeString, 'HH:mm:ss').format('HH:mm');
}

export function formatTimeAm(timeString) {
    return dayjs(timeString, formatToTime).format(formatToTimeAm);
}