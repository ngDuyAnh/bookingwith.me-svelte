import {get, writable} from "svelte/store";
import {business} from "$lib/page/stores/business/business.js";
import {validateManagerAccess} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
import {
    handleCloseGetManagerPasswordModal
} from "$lib/components/Modal/GetManagerPasswordModal/stores/getManagerPasswordModal.js";

export const managerAccess = writable(false);

export async function grantManagerAccess(managerPassword)
{
    const businessValue = get(business);

    // Fetch from the backend to validate the manager access request
    try
    {
        await validateManagerAccess(businessValue.businessInfo.businessID, managerPassword);

        // Able to access
        managerAccess.set(true);

        // Revoke access after 1 minute (60000 milliseconds)
        setTimeout(() => {
            managerAccess.set(false);
        }, 30000);

        // Close the modal
        handleCloseGetManagerPasswordModal();
    }
    catch (error)
    {
        alert('Failed to grant access!');
        disableManagerAccess();
    }
}

export function disableManagerAccess()
{
    managerAccess.set(false);
}
