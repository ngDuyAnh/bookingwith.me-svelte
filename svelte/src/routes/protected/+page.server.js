import {OAuth2Client} from "google-auth-library";
import {ORIGIN, SECRET_CLIENT_ID, SECRET_CLIENT_SECRET} from "$env/static/private";
import {redirect} from "@sveltejs/kit";
import {login} from "$lib/api/api_server/user-portal/api.js";

export async function load({ cookies }) {
    const authCookie = await cookies.get('auth');
    const auth = authCookie ? JSON.parse(authCookie) : null;

    // Get the user profile from the api backend
    let user = null;
    if (auth)
    {
        user = await login(auth.email);
    }

    // Return data
    return {
        props: {
            auth,
            user
        }
    };
}

export const actions={
    OAuth2: async()=> {
        const redirectURL = `${ORIGIN}/oauth`;

        const oAuth2Client = new OAuth2Client(SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, redirectURL);

        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['profile', 'email'],
            prompt: 'consent'
        });

        throw redirect(302, authorizeUrl);
    },

    logout: async ({ cookies }) => {
        cookies.delete('auth', { path: '/' });
        cookies.delete('user', { path: '/' });
        throw redirect(302, '/'); // Redirect to home or login page
    }
}