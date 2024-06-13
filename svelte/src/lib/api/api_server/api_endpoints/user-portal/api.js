import {API_BASE_URL} from "$lib/api/api_server/API-URL.js";

const API_URL = `${API_BASE_URL}/user-portal`;

export async function login(email)
{
    const FETCH_URL = `${API_URL}/login/${email}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch valid access. Status: ${response.status}`);
    }

    return response.json();
}
