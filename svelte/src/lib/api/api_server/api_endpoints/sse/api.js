import {API_BASE_URL} from "$lib/api/api_server/API-URL.js";

const API_URL = `${API_BASE_URL}/sse`;

export const SseEvent = {
    BUSINESS_UPDATE: "BUSINESS_UPDATE",
    EMPLOYEE_WORK_SCHEDULE_UPDATE: "EMPLOYEE_WORK_SCHEDULE_UPDATE",
    CUSTOMER_BOOKING_UPDATE: "CUSTOMER_BOOKING_UPDATE",
    TEST: "TEST"
};

export function listenSseFrom(businessID) {
    return API_URL + '/stream-sse/' + businessID;
}
