import dayjs from "dayjs";
import {formatToDate} from "$lib/application/Formatter.js";

export function checkAbleToSendSmsReviewReminder(checkAbleToSendresponse)
{
    const { allowToSendReviewReminderSMS, mostRecentDateReviewReminderSent } = checkAbleToSendresponse;

    // Check if the most recent send date is more than 6 months ago
    // The customer is new to the business
    const moreThan6Months = mostRecentDateReviewReminderSent
        ? dayjs().diff(dayjs(mostRecentDateReviewReminderSent, formatToDate), 'month') > 6
        : true;

    // Return
    return allowToSendReviewReminderSMS && moreThan6Months;
}
