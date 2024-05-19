import {OAuth2Client} from "google-auth-library";
import {SECRET_CLIENT_ID, SECRET_CLIENT_SECRET} from "$env/static/private";
import {redirect} from "@sveltejs/kit";

export async function load({ cookies }) {
    const authCookie = await cookies.get('auth');
    const userCookie = await cookies.get('user');

    const auth = authCookie ? JSON.parse(authCookie) : undefined;
    const user = userCookie ? JSON.parse(userCookie) : undefined;

    /*if (!auth || !user) {
        throw redirect(303, '/signup');
    }*/

    return {
        props: {
            auth,
            user
        }
    };
}

export const actions={
    OAuth2: async()=> {
        const redirectURL = 'https://anh.bookingwith.me/oauth';

        const oAuth2Client = new OAuth2Client(SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, redirectURL);

        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['profile', 'email'],
            prompt: 'consent'
        });

        throw redirect(302, authorizeUrl);
    }
}
