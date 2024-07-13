import {get, writable} from "svelte/store";
import {getCustomerProfile} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
import {business} from "$lib/page/stores/business/business.js";

export const customerProfileModal = writable({
    open: false,
    customerProfile: undefined,
});

export async function handleOpenCustomerProfileModal(phoneNumber)
{
    const businessValue = get(business);

    // Get the customer profile
    let responseCustomerProfile = await getCustomerProfile(
        businessValue.businessInfo.businessID, phoneNumber
    );

    customerProfileModal.set({
        open: true,
        customerProfile: responseCustomerProfile
    });
}
