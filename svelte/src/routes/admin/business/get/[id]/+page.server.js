import { error } from '@sveltejs/kit';
import {getBusiness} from "$lib/api/api_server/business-portal/api.js";

export async function load({ params }) {
    // Access the dynamic parameter from the URL
    const { id } = params;

    // Get the business information
    const business = await getBusiness(id);

    if (!business) throw error(404);

    return {
        business
    };
}
