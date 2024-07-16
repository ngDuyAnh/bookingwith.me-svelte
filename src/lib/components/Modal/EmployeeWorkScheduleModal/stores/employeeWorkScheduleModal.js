import {get, writable} from "svelte/store";
import {
    getEmployeeWorkSchedule,
    initializeEmployeeWorkSchedule
} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
import {DayOfWeek} from "$lib/application/DayOfWeek.js";

export const employeeWorkScheduleModal = writable({
    open: false,
    employee: undefined,
    workSchedule: undefined
});

export async function handleOpenEmployeeWorkScheduleModal(employee)
{
    try
    {
        // Get the employee work schedule data
        const scheduleData = await getEmployeeWorkSchedule(employee.id);

        console.log("scheduleData", scheduleData)

        // Extract the work schedule
        const employeeWorkSchedule = DayOfWeek.map(day => {
            const dayToUpper = day.toUpperCase();
            const activeDay = scheduleData.workScheduleList.find(d => d.dayOfWeek.toUpperCase() === dayToUpper);
            return {
                dayOfWeek: day,
                startTime: activeDay ? activeDay.startTime : '',
                endTime: activeDay ? activeDay.endTime : '',
                isActive: !!activeDay
            };
        });

        console.log("employeeWorkSchedule", employeeWorkSchedule);

        // Open the modal
        employeeWorkScheduleModal.set({
            open: true,
            employee: employee,
            workSchedule: employeeWorkSchedule
        });

        // const employeeWorkScheduleModalValue = get(employeeWorkScheduleModal);
        // console.log("employeeWorkScheduleModalValue", employeeWorkScheduleModalValue);
    }
    catch (error)
    {
        alert(error);
    }
}

export function handleCloseEmployeeWorkScheduleModal()
{
    employeeWorkScheduleModal.set({
        open: false,
        employee: undefined,
        workSchedule: undefined
    });
}

export function handleSaveEmployeeWorkScheduleModal()
{
    const employeeWorkScheduleModalValue = get(employeeWorkScheduleModal);

    console.log('Updating employee work schedule:', employeeWorkScheduleModalValue.employee);

    // Prepare the work schedule list for JSON
    const workScheduleList = employeeWorkScheduleModalValue.workSchedule
        .filter(schedule =>
            schedule.isActive && schedule.startTime && schedule.endTime && schedule.startTime <= schedule.endTime)
        .map(schedule => ({
            "dayOfWeek": schedule.dayOfWeek.toUpperCase(),
            "startTime": schedule.startTime.substring(0, 5) || null,  // Ensure null instead of empty string if not set
            "endTime": schedule.endTime.substring(0, 5) || null
        }));

    // console.log("workScheduleList", workScheduleList);

    // Employee work schedule
    const employeeWorkSchedule = {
        "employee": employeeWorkScheduleModalValue.employee,
        "workScheduleList": workScheduleList
    }

    // console.log("employeeWorkSchedule", employeeWorkSchedule)

    // Request the server to update
    initializeEmployeeWorkSchedule(employeeWorkSchedule)
        .then(() => {
            console.log("Saved the employee work schedule to the database.")
        });

    // Close the modal
    handleCloseEmployeeWorkScheduleModal();
}

export function handleToggleWorkScheduleDayEmployeeWorkScheduleModal(dayIndex) {

    const employeeWorkScheduleModalValue = get(employeeWorkScheduleModal);

    employeeWorkScheduleModalValue.workSchedule[dayIndex].isActive = !employeeWorkScheduleModalValue.workSchedule[dayIndex].isActive;
    if (!employeeWorkScheduleModalValue.workSchedule[dayIndex].isActive) {
        employeeWorkScheduleModalValue.workSchedule[dayIndex].startTime = '';
        employeeWorkScheduleModalValue.workSchedule[dayIndex].endTime = '';
    }
}
