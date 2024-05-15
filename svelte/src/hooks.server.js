import {redirect} from "@sveltejs/kit";
import {login} from "$lib/api/api_server/user-portal/api.js";

export async function handle({ event, resolve })
{
    // Protected route
    if (event.url.pathname.startsWith('/protected'))
    {
        // Check for user authentication
        try
        {
            const authCookies = JSON.parse(event.cookies.get('auth'));

            console.log("authCookies", authCookies);
            console.log("email", authCookies.email);

            // Get the user
            const response = await login(authCookies.email);
            console.log("login", response);

            event.cookies.set('userInfo', response, { path: '/', httpOnly: true, secure: true });
        }
        catch (err)
        {
            console.log("error", err);
            throw redirect(303,'/signup');
        }

        // No user login


        //return new Response('custom response');
    }

    const response = await resolve(event);
    return response;
}
