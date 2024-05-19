import {redirect} from "@sveltejs/kit";
import {OAuth2Client} from "google-auth-library"
import {SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, ORIGIN} from "$env/static/private";

export const GET = async ({url, cookies})=>{
    const redirectURL = `${ORIGIN}/oauth`;
    const code = await url.searchParams.get('code');

    try
    {
        const oAuth2Client = new OAuth2Client(SECRET_CLIENT_ID, SECRET_CLIENT_SECRET, redirectURL);

        // Get the token
        const r = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(r.tokens);

        // Get the user credential
        const userCredentials = oAuth2Client.credentials;

        // Fetch userinfo from Google
        const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userCredentials.access_token}`);
        if (!userInfoResponse.ok) {
            throw new Error('Failed to fetch user information from Google.');
        }
        const auth = await userInfoResponse.json();

        // Cookies for the authentication
        cookies.set("auth", JSON.stringify(auth), {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
            secure: true
        });
    }
    catch(err)
    {
        throw redirect(303,'/oauth/error');
    }

    // Redirect to user page
    throw redirect(302, '/');
}
