import {PUBLIC_API_BASE_URL} from "$env/static/public";

const API_URL = `${PUBLIC_API_BASE_URL}/user-portal`;

export async function login(email)
{
    const FETCH_URL = `${API_URL}/login/${email}`;

    const response = await fetch(`${FETCH_URL}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch valid access. Status: ${response.status}`);
    }

    return response.json();
}
