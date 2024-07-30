import {get, writable} from "svelte/store";
import {isPast, isToday, nowTime, today} from "$lib/page/stores/business/business.js";
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
export async function handleScheduleUpdate(eventData) {
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

export function findEmployeeTimetable(user)
{
    const timetableComponentValue = get(timetableComponent);

    return timetableComponentValue.employeeTimetableList.find(
        timetable => timetable.employee.user && timetable.employee.user.email === user.email
    );
}

export function findServicingTicketByIndividualID(individualID)
{
    const timetableComponentValue = get(timetableComponent);

    // Find the servicing tickets associate with the individual
    let servicingTicketList = [];
    for (let employeeTimetable of timetableComponentValue.employeeTimetableList) {
        for (let ticket of employeeTimetable.servicingTicketList) {
            if (ticket.individualID === individualID) {
                servicingTicketList.push(ticket);
            }
        }
    }
    return servicingTicketList;
}

export function timetableSortServiceBookingList(individual, serviceBookingID, newStartTime)
{
    // Fetch and reduce servicing tickets to map
    let servicingTicketList = findServicingTicketByIndividualID(individual.individualID);

    // Sort the servicing tickets by their startTime
    servicingTicketList.sort((a, b) => {
        // Extract the startTime from the timePeriod object of each ticket
        const startTimeA = a.timePeriod.startTime;
        const startTimeB = b.timePeriod.startTime;

        // Compare the start times to determine order; this will sort in ascending order
        return startTimeA.localeCompare(startTimeB);
    });

    // Extract by serviceBookingID and start time
    // Need to keep the order index to ensure the order for the backend
    servicingTicketList = servicingTicketList.map((ticket, index) => ({
        ...ticket,
        originalIndex: index  // Add original index to each ticket
    }));
    const serviceBookingIDMap = servicingTicketList.reduce((acc, ticket) => {
        const { serviceBookingID, timePeriod: { startTime }, originalIndex } = ticket;

        // Check if this serviceBookingID already has a recorded startTime or if the current startTime is earlier
        if (!acc[serviceBookingID] || acc[serviceBookingID].startTime > startTime) {
            acc[serviceBookingID] = { startTime, originalIndex };  // Record the startTime and originalIndex
        }

        return acc;
    }, {});

    // Convert the map to an array of objects, considering the original index for stable sorting
    let serviceBookingIdList = Object.entries(serviceBookingIDMap).map(([serviceBookingID, {startTime, originalIndex}]) => ({
        serviceBookingID: parseInt(serviceBookingID, 10),  // Convert to integer
        startTime,
        originalIndex
    }));

    // Sort by startTime and use originalIndex to break ties
    serviceBookingIdList.sort((a, b) => {
        const timeCompare = a.startTime.localeCompare(b.startTime);
        if (timeCompare === 0) {
            return a.originalIndex - b.originalIndex;  // Use original index to maintain the order for same startTime
        }
        return timeCompare;
    });

    // Find the clicked serviceBooking and adjust the start time
    serviceBookingIdList = serviceBookingIdList.map(item => {
        if (item.serviceBookingID === serviceBookingID) {
            // When drag to same time as another service booking, do not change the order
            return {
                ...item,
                startTime: newStartTime
            };
        }
        return item;
    });

    // console.log("initialize time serviceBookingIdList", serviceBookingIdList)

    // Sort the list based on the start time, using originalIndex as a tiebreaker for stability
    serviceBookingIdList.sort((a, b) => {
        // Primary sort by startTime
        let order = a.startTime.localeCompare(b.startTime);

        // If the start times are the same
        // Custom handle if one of the item is serviceBookingID
        if (order === 0)
        {
            // Maintain order with original indices
            order = a.originalIndex - b.originalIndex;

            // If a is the target serviceBookingID
            if (a.serviceBookingID === serviceBookingID) {
                // If originalIndex of a is less than originalIndex of b, place a before b
                if (a.originalIndex < b.originalIndex) {
                    order = 1;
                }
                // Otherwise, place a after b
                else {
                    order = -1;
                }
            }
            // If b is the target serviceBookingID
            else if (b.serviceBookingID === serviceBookingID) {
                // If originalIndex of b is less than originalIndex of a, place b before a
                if (b.originalIndex < a.originalIndex) {
                    return 1;
                }
                // Otherwise, place b after a
                else {
                    order = -1;
                }
            }
        }

        // Return
        return order;
    });

    // console.log("sort serviceBookingIdList", serviceBookingIdList);

    // Create a map where each serviceBookingID is mapped to its sort order index
    const sortOrderMap =
        new Map(serviceBookingIdList.map(
            (item, index) => [item.serviceBookingID, index]));

    // Sort the serviceBooking in the individual
    individual.customerIndividualServiceBookingList.sort((a, b) => {
        // Get the sort order indexes for each serviceBookingID
        const indexA = sortOrderMap.get(a.serviceBookingID);
        const indexB = sortOrderMap.get(b.serviceBookingID);

        // Sort by the retrieved indexes
        return indexA - indexB;
    });

    // console.log("individual.customerIndividualServiceBookingList", individual.customerIndividualServiceBookingList);
}
