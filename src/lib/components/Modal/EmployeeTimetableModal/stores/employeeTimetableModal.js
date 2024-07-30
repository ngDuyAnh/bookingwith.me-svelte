import {get, writable} from "svelte/store";
import {getDurationInMinutes, getEndTime, TimePeriod} from "$lib/api/initialize_functions/TimePeriod.js";
import {
    getEmployeeWorkScheduleException,
    initializeEmployeeWorkScheduleException
} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
import {nowTime, today} from "$lib/page/stores/business/business.js";
import {business} from "$lib/page/stores/business/business.js";
import {initializeEmployeeTimetableBlockTicket} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
import {EmployeeTimetableBlockTicket} from "$lib/api/initialize_functions/Business.js";
import {Employee} from "$lib/api/initialize_functions/Business.js";

const DEFAULT_DURATION = 30; // Minutes

export const employeeTimetableModal = writable({
    open: false,
    employee: Employee(),
    date: today(),
    workScheduleTimePeriod: TimePeriod(),
    showBlockTimePeriod: true,
    blockTimePeriod: TimePeriod()
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
            workSchedule = await getEmployeeWorkScheduleException(
                employee.id, date);
        }

        // Get the block time period
        // If it is today, initialize the time based on the current time
        let showBlockTimePeriod = false;
        let blockTimePeriod = {
            startTime: null,
            endTime: null
        };
        if (getDurationInMinutes(workSchedule.timePeriod))
        {
            showBlockTimePeriod = true;

            const nowTimeValue = nowTime();
            blockTimePeriod = {
                startTime: nowTimeValue,
                endTime: getEndTime(nowTimeValue, DEFAULT_DURATION)
            }
        }

        // Open the modal
        employeeTimetableModal.set({
            open: true,
            employee: employee,
            date: date,
            workScheduleTimePeriod: workSchedule.timePeriod,
            showBlockTimePeriod: showBlockTimePeriod,
            blockTimePeriod: blockTimePeriod
        });

        // const employeeTimetableModalValue = get(employeeTimetableModal);
        // console.log("employeeTimetableModalValue", employeeTimetableModalValue);
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
        workScheduleTimePeriod: TimePeriod(),
        showBlockTimePeriod: true,
        blockTimePeriod: TimePeriod()
    });
}

export function handleSelectEmployeeForEmployeeTimetableModal(employee)
{
    const employeeTimetableModalValue = get(employeeTimetableModal);

    handleOpenEmployeeTimetableModal(employee, employeeTimetableModalValue.date)
        .then(() => {
            console.log("handleSelectEmployeeForEmployeeTimetableModal", employee);
        });
}

export function handleSaveEmployeeWorkScheduleException()
{
    const employeeTimetableModalValue = get(employeeTimetableModal);

    if (employeeTimetableModalValue.employee &&
        employeeTimetableModalValue.date &&
        employeeTimetableModalValue.workScheduleTimePeriod &&
        employeeTimetableModalValue.workScheduleTimePeriod.startTime <= employeeTimetableModalValue.workScheduleTimePeriod.endTime &&
        confirm(`Confirm changing ${employeeTimetableModalValue.employee.employeeName} work schedule on ${employeeTimetableModalValue.date}?`))
    {
        // Employee work schedule exception
        const employeeWorkSchedule = {
            "employee": employeeTimetableModalValue.employee,
            "date": employeeTimetableModalValue.date,
            "timePeriod": employeeTimetableModalValue.workScheduleTimePeriod
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

export function handleStartTimeChangeForBlockTimePeriodEmployeeTimetableModal(startTime)
{
    const employeeTimetableModalValue = get(employeeTimetableModal);

    employeeTimetableModal.set({
        ...employeeTimetableModalValue,
        blockTimePeriod: {
            startTime: startTime,
            endTime: getEndTime(startTime, DEFAULT_DURATION)
        }
    });
}

export function handleAddBlockTicket()
{
    const employeeTimetableModalValue = get(employeeTimetableModal);

    if (employeeTimetableModalValue.employee &&
        employeeTimetableModalValue.date &&
        employeeTimetableModalValue.blockTimePeriod &&
        employeeTimetableModalValue.blockTimePeriod.startTime < employeeTimetableModalValue.blockTimePeriod.endTime)
    {
        const businessValue = get(business);

        // Block ticket
        const blockTicket = {
            ...EmployeeTimetableBlockTicket(),
            "employee": employeeTimetableModalValue.employee,
            "date": employeeTimetableModalValue.date,
            "startTime": employeeTimetableModalValue.blockTimePeriod.startTime,
            "duration": getDurationInMinutes(employeeTimetableModalValue.blockTimePeriod)
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
