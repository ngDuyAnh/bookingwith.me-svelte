import {get, writable} from "svelte/store";
import {TimePeriod} from "$lib/api/initialize_functions/TimePeriod.js";
import {
    getEmployeeWorkScheduleException,
    initializeEmployeeWorkScheduleException
} from "$lib/api/api_server/api_endpoints/business-portal/api.js";

export const employeeWorkScheduleExceptionModal = writable({
    open: false,
    employee: undefined,
    date: undefined,
    workScheduleTimePeriod: TimePeriod()
});

export async function handleOpenEmployeeWorkScheduleExceptionModal(employee, date)
{
    try
    {
        // Employee is selected
        // That mean it is not null
        let scheduleData = {
            employee,
            date: date,
            timePeriod: {
                startTime: "00:00",
                endTime: "00:00"
            }
        }
        if (employee)
        {
            // Get the employee work schedule data
            scheduleData = await getEmployeeWorkScheduleException(
                employee.id, date);

            // console.log("scheduleData", scheduleData)
        }

        // Open the modal
        employeeWorkScheduleExceptionModal.set({
            open: true,
            employee: scheduleData.employee,
            date: scheduleData.date,
            workScheduleTimePeriod: scheduleData.timePeriod
        });

        // const employeeWorkScheduleExceptionModalValue = get(employeeWorkScheduleExceptionModal);
        // console.log("employeeWorkScheduleExceptionModalValue", employeeWorkScheduleExceptionModalValue);
    }
    catch (error)
    {
        alert(error);
    }
}

export function handleCloseEmployeeWorkScheduleExceptionModal()
{
    employeeWorkScheduleExceptionModal.set({
        open: false,
        employee: undefined,
        date: undefined,
        workScheduleTimePeriod: TimePeriod()
    });
}

export async function handleSelectEmployeeForEmployeeWorkScheduleExceptionModal(employee)
{
    // Ensure that employee is selected
    // Not null
    if (employee)
    {
        const employeeWorkScheduleExceptionModalValue = get(employeeWorkScheduleExceptionModal);

        // Get the employee work schedule data
        const scheduleData = await getEmployeeWorkScheduleException(
            employee.id, employeeWorkScheduleExceptionModalValue.date);

        // Set the work schedule
        employeeWorkScheduleExceptionModal.set({
            ...employeeWorkScheduleExceptionModalValue,
            employee: scheduleData.employee,
            workScheduleTimePeriod: scheduleData.timePeriod
        });
    }
}

export function handleSaveEmployeeWorkScheduleExceptionModal()
{
    const employeeWorkScheduleExceptionModalValue = get(employeeWorkScheduleExceptionModal);

    if (employeeWorkScheduleExceptionModalValue.employee &&
        employeeWorkScheduleExceptionModalValue.date &&
        employeeWorkScheduleExceptionModalValue.workScheduleTimePeriod &&
        employeeWorkScheduleExceptionModalValue.workScheduleTimePeriod.startTime < employeeWorkScheduleExceptionModalValue.workScheduleTimePeriod.endTime)
    {
        // Employee work schedule exception
        const employeeWorkSchedule = {
            "employee": employeeWorkScheduleExceptionModalValue.employee,
            "date": employeeWorkScheduleExceptionModalValue.date,
            "timePeriod": employeeWorkScheduleExceptionModalValue.workScheduleTimePeriod
        }

        // Request the server to update
        initializeEmployeeWorkScheduleException(employeeWorkSchedule)
            .then(() => {
                console.log("Saved the employee work schedule to the database.")
            });

        // Close the modal
        handleCloseEmployeeWorkScheduleExceptionModal();
    }
    else
    {
        alert("Please ensure that employee and time period are selected correctly!");
    }
}
