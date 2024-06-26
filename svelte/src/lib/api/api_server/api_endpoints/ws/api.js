import {API_BASE_URL} from "$lib/api/api_server/API-URL.js";
import {business} from "$lib/page/stores/business/business.js";

export const ServerEvent = {
    TEST: "TEST",

    EVENT_REQUEST: "EVENT_REQUEST",
    EVENT_CONFIRMATION: "EVENT_CONFIRMATION",

    UPDATE_BUSINESS: "UPDATE_BUSINESS",
    UPDATE_EMPLOYEE_WORK_SCHEDULE: "UPDATE_EMPLOYEE_WORK_SCHEDULE",
    UPDATE_CUSTOMER_BOOKING: "UPDATE_CUSTOMER_BOOKING",
    UPDATE_SCHEDULE: "UPDATE_SCHEDULE",
};

export function listenSocketFrom(businessID) {
    return API_BASE_URL + '/ws/' + businessID;
}

export function eventConfirmation(socket, requestId, confirmed) {
    if (socket && socket.readyState === WebSocket.OPEN)
    {
        const confirmationMessage = JSON.stringify({
            type: ServerEvent.EVENT_CONFIRMATION,
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
    console.log(`Handle ${ServerEvent.UPDATE_BUSINESS}`, event)
    business.set(event.data);
}
