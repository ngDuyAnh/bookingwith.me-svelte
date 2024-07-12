import {get, writable} from "svelte/store";
import {isPast, isToday, nowTime, today} from "$lib/page/stores/now/now_dayjs_store.js";
import {business} from "$lib/page/stores/business/business.js";
import {getSchedule} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";

export const timetableComponent = writable({
    date: today(),
    currentTime: nowTime(),
    employeeTimetableList: []
});

export async function fetchTimetable(dateString) {
    //console.log("selectedDate", dateString)

    const businessValue = get(business);

    // Get the current time based on if it is today
    let currentTimeString = "00:00";
    if (isToday(dateString)) {
        currentTimeString = nowTime();
    }
    else if (isPast(dateString))
    {
        currentTimeString = "23:59";
    }

    // Fetch the schedule based on date
    try {
        let response = await getSchedule(
            businessValue.businessInfo.businessID,
            dateString,
            currentTimeString
        );

        // Set the updated timetable
        timetableComponent.set({
            ...response
        });
    } catch (error) {
        console.error("Failed to  fetch timetable", error);
        timetableComponent.set({
            date: dateString,
            currentTime: "23:59",
            employeeTimetableList: []
        });
    }
}

/*
export  async function handleScheduleUpdate(eventData) {
    const data = eventData.data;

    const timetableComponentValue = get(timetableComponent);

    // If same date and the data currentTime is after
    if (data.date === timetableComponentValue.date &&
        data.currentTime >= timetableComponentValue.currentTime)
    {
        timetableComponent.set(data);
    }
}
*/
