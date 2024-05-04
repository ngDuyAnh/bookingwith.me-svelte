
export const formatToDate = "YYYY-MM-DD";
export const formatToTime = "HH:mm";
export const formatToTimeAM = "hh:mm a";

export function formatTimeWithoutSeconds(timeString) {
    return dayjs(timeString, 'HH:mm:ss').format('HH:mm');
}
