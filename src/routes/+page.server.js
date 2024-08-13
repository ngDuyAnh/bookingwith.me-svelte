import {login} from "$lib/api/api_server/api_endpoints/user-portal/api.js";
import {redirect} from "@sveltejs/kit";

export async function load({ cookies }) {
    const authCookie = await cookies.get('auth');
    const auth = authCookie ? JSON.parse(authCookie) : null;

    // Get the user profile from the api backend
    let user = null;
    let valid=false;
    if (auth)
    {
        try{
            user = await login(auth.email);
            valid=true;
        }
        catch{
            valid=false;
        }
    }

    // Return data
    return {
        valid:valid,
        userProfile: {
            auth,
            user
        }
    };
}


export const actions={

    logout: async ({ cookies }) => {
        cookies.delete('auth', { path: '/' });
        cookies.delete('user', { path: '/' });
        throw redirect(302, '/'); // Redirect to home or login page
    }
}