import {
    BusinessInformation
} from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions/Business.js";

export const UserRole = {
    ADMIN: "ADMIN",
    BUSINESS_ADMIN: "BUSINESS_ADMIN",
    LOBBY: "LOBBY",
    EMPLOYEE: "EMPLOYEE",
    REGISTER: "REGISTER"
}

export function User() {
    return {
        "email": "",
        "businessInfo": BusinessInformation(),
        "role": UserRole.REGISTER,
    }
}
