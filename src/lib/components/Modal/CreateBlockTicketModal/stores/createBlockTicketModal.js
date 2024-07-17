import {get, writable} from "svelte/store";
import {getEndTime, TimePeriod} from "$lib/api/initialize_functions/TimePeriod.js";
import {isToday, nowTime} from "$lib/page/stores/now/now_dayjs_store.js";
import {EmployeeTimetableBlockTicket} from "$lib/api/initialize_functions/CustomerBooking.js";
import {business} from "$lib/page/stores/business/business.js";
import {initializeEmployeeTimetableBlockTicket} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";

const DEFAULT_DURATION = 30; // Minutes

export const createBlockTicketModal = writable({
    open: false,
    blockTicket: EmployeeTimetableBlockTicket()
});

export function handleOpenCreateBlockTicketModal(date)
{
    // It is today
    let timePeriod = TimePeriod();
    if (isToday(date))
    {
        timePeriod.startTime = nowTime();
        timePeriod.endTime = getEndTime(timePeriod.startTime, DEFAULT_DURATION);
    }

    createBlockTicketModal.set({
        open: true,
        blockTicket: {
            ...EmployeeTimetableBlockTicket(),
            timePeriod: timePeriod
        }
    });
}

export function handleCloseCreateBlockTicketModal()
{
    createBlockTicketModal.set({
        open: false,
        blockTicket: EmployeeTimetableBlockTicket()
    });
}

export async function handleSelectEmployeeForCreateBlockTimeModal(employee)
{
    // Ensure that employee is selected
    // Not null
    if (employee)
    {
        const createBlockTicketModalValue = get(createBlockTicketModal);

        // Set the employee
        createBlockTicketModal.set({
            ...createBlockTicketModalValue,
            blockTicket: {
                ...createBlockTicketModalValue.blockTicket,
                employee: employee
            }
        });
    }
}

export function handleStartTimeChangeForCreateBlockTicketModal(startTime)
{
    const createBlockTicketModalValue = get(createBlockTicketModal);

    createBlockTicketModal.set({
        ...createBlockTicketModalValue,
        blockTicket: {
            ...createBlockTicketModalValue.blockTicket,
            timePeriod: {
                startTime: startTime,
                endTime: getEndTime(startTime, DEFAULT_DURATION)
            }
        }
    });
}

export function handleEndTimeChangeForCreateBlockTicketModal(endTime)
{
    const createBlockTicketModalValue = get(createBlockTicketModal);

    createBlockTicketModal.set({
        ...createBlockTicketModalValue,
        blockTicket: {
            ...createBlockTicketModalValue.blockTicket,
            timePeriod: {
                startTime: createBlockTicketModalValue.blockTicket.timePeriod.startTime,
                endTime: endTime
            }
        }
    })
}

export function handleSaveForCreateBlockTicketModal()
{
    const createBlockTicketModalValue = get(createBlockTicketModal);

    if (createBlockTicketModalValue.employee &&
        createBlockTicketModalValue.blockTicket &&
        createBlockTicketModalValue.timePeriod &&
        createBlockTicketModalValue.timePeriod.startTime < createBlockTicketModalValue.timePeriod.endTime)
    {
        const businessValue = get(business);

        // Request the server to update
        initializeEmployeeTimetableBlockTicket(
            businessValue.businessInfo.businessID, createBlockTicketModalValue.blockTicket)
            .then(() => {
                console.log("Saved the block ticket to the employee timetable.")
            });

        // Close the modal
        handleCloseCreateBlockTicketModal();
    }
    else
    {
        alert("Please ensure that employee and time period are selected correctly!");
    }
}
