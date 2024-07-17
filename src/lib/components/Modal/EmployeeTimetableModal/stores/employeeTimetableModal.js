import {get, writable} from "svelte/store";
import {getEndTime, TimePeriod} from "$lib/api/initialize_functions/TimePeriod.js";
import {
    getEmployeeWorkScheduleException,
    initializeEmployeeWorkScheduleException
} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
import {isToday, nowTime, today} from "$lib/page/stores/now/now_dayjs_store.js";
import {business} from "$lib/page/stores/business/business.js";
import {initializeEmployeeTimetableBlockTicket} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
import {EmployeeTimetableBlockTicket} from "$lib/api/initialize_functions/CustomerBooking.js";
import {Employee} from "$lib/api/initialize_functions/Business.js";

const DEFAULT_DURATION = 30; // Minutes

export const employeeTimetableModal = writable({
    open: false,
    employee: Employee(),
    date: today(),
    timePeriod: TimePeriod()
});

export async function handleOpenEmployeeTimetableModal(employee, date)
{
    try
    {
        // Get the employee work schedule
        let workSchedule = {
            employee: employee,
            date: date,
            timePeriod: TimePeriod()
        }
        if (employee)
        {
            // Get the employee work schedule data
            workSchedule = await getEmployeeWorkScheduleException(
                employee.id, date);
        }

        // If it is today
        let timePeriod = TimePeriod();
        if (isToday())
        {
            // The current time is before the working time
            // Most likely the user want to edit the employee work schedule
            if (nowTime() < workSchedule.timePeriod.startTime)
            {
                timePeriod = workSchedule.timePeriod;
            }
            // Otherwise most likely the user want to add block ticket
            else
            {
                timePeriod = {
                    startTime: nowTime(),
                    endTime: getEndTime(timePeriod.startTime, DEFAULT_DURATION)
                }
            }
        }
        // Not today
        // Default to work schedule
        else
        {
            timePeriod = workSchedule.timePeriod;
        }

        // Open the modal
        employeeTimetableModal.set({
            open: true,
            employee: employee,
            date: date,
            timePeriod: timePeriod
        });
    }
    catch (error)
    {
        alert(error);
    }
}

export function handleCloseEmployeeTimetableModal()
{
    employeeTimetableModal.set({
        open: false,
        employee: Employee(),
        date: today(),
        timePeriod: TimePeriod()
    });
}

export function handleSelectEmployeeForEmployeeTimetableModal(employee)
{
    const employeeTimetableModalValue = get(employeeTimetableModal);

    handleOpenEmployeeTimetableModal(employee, employeeTimetableModalValue.date)
        .then(() => {});
}

export function handleSaveEmployeeWorkScheduleException()
{
    const employeeTimetableModalValue = get(employeeTimetableModal);

    if (employeeTimetableModalValue.employee &&
        employeeTimetableModalValue.date &&
        employeeTimetableModalValue.timePeriod &&
        employeeTimetableModalValue.timePeriod.startTime < employeeTimetableModalValue.timePeriod.endTime &&
        confirm(`Confirm changing ${employeeTimetableModalValue.employee.employeeName} work schedule on ${employeeTimetableModalValue.date}?`))
    {
        // Employee work schedule exception
        const employeeWorkSchedule = {
            "employee": employeeTimetableModalValue.employee,
            "date": employeeTimetableModalValue.date,
            "timePeriod": employeeTimetableModalValue.timePeriod
        }

        // Request the server to update
        initializeEmployeeWorkScheduleException(employeeWorkSchedule)
            .then(() => {
                console.log("Saved the employee work schedule to the database.")
            });

        // Close the modal
        handleCloseEmployeeTimetableModal();
    }
    else
    {
        alert("Please ensure that employee and time period are selected correctly!");
    }
}

export function handleStartTimeChangeForEmployeeTimetableModal(startTime)
{
    const employeeTimetableModalValue = get(employeeTimetableModal);

    employeeTimetableModal.set({
        ...employeeTimetableModalValue,
        timePeriod: {
            startTime: startTime,
            endTime: getEndTime(startTime, DEFAULT_DURATION)
        }
    });
}

export function handleEndTimeChangeForEmployeeTimetableModal(endTime)
{
    const employeeTimetableModalValue = get(employeeTimetableModal);

    employeeTimetableModal.set({
        ...employeeTimetableModalValue,
        timePeriod: {
            startTime: employeeTimetableModalValue.timePeriod.startTime,
            endTime: endTime
        }
    });
}

export function handleAddBlockTicket()
{
    const employeeTimetableModalValue = get(employeeTimetableModal);

    if (employeeTimetableModalValue.employee &&
        employeeTimetableModalValue.date &&
        employeeTimetableModalValue.timePeriod &&
        employeeTimetableModalValue.timePeriod.startTime < employeeTimetableModalValue.timePeriod.endTime)
    {
        const businessValue = get(business);

        // Block ticket
        const blockTicket = {
            ...EmployeeTimetableBlockTicket(),
            "employee": employeeTimetableModalValue.employee,
            "date": employeeTimetableModalValue.date,
            "timePeriod": employeeTimetableModalValue.timePeriod
        }

        // Request the server to update
        initializeEmployeeTimetableBlockTicket(
            businessValue.businessInfo.businessID, blockTicket)
            .then(() => {
                console.log("Saved the block ticket to the employee timetable.")
            });

        // Close the modal
        handleCloseEmployeeTimetableModal();
    }
    else
    {
        alert("Please ensure that employee and time period are selected correctly!");
    }
}


