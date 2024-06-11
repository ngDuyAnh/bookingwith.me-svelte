import {error} from "@sveltejs/kit";
import {getBusiness} from "$lib/api/api_server/business-portal/api.js";

export async function load({ params }) {
    // Access the dynamic parameter from the URL
    const { businessID } = params;

    // Get the business
    let business = await getBusiness(businessID);

    // The business is not active
    // Send to error page
    if (!business.businessInfo.active)
    {
        throw error(400, 'Business is not active');
    }

    // Return data
    return {
        business
    };
}
