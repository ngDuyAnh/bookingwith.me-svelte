import {API_BASE_URL} from "$lib/api/api_server/API-URL.js";
import {business} from "$lib/page/stores/business/business.js";

export const ServerEvent = {
    EVENT_REQUEST: "EVENT_REQUEST",

    BUSINESS_UPDATE: "BUSINESS_UPDATE",
    EMPLOYEE_WORK_SCHEDULE_UPDATE: "EMPLOYEE_WORK_SCHEDULE_UPDATE",
    CUSTOMER_BOOKING_UPDATE: "CUSTOMER_BOOKING_UPDATE",

    TEST: "TEST"
};

export function listenSocketFrom(businessID) {
    return API_BASE_URL + '/ws/' + businessID;
}

export function eventConfirmation(socket, requestId, confirmed) {
    if (socket && socket.readyState === WebSocket.OPEN)
    {
        const confirmationMessage = JSON.stringify({
            type: "EVENT_CONFIRMATION",
            requestId: requestId,
            confirmed: confirmed
        });

        socket.send(confirmationMessage);
    } else {
        console.error("WebSocket is not connected.");
    }
}

export function handleUnknownEvent(event) {
    console.error("Handle unknown event:", event);
}

export function handleTestEvent(event) {
    console.log(`Handle ${ServerEvent.TEST}`, event)
}

export function handleBusinessUpdate(event) {
    console.log(`Handle ${ServerEvent.BUSINESS_UPDATE}`, event)
    business.set(event.data);
}
