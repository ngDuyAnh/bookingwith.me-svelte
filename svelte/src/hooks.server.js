import {redirect} from "@sveltejs/kit";
import {login} from "$lib/api/api_server/user-portal/api.js";

export async function handle({ event, resolve })
{
    // Protected route
    if (event.url.pathname.startsWith('/protected'))
    {
        console.log("here");
        // Check for user authentication
        try
        {
            console.log("event cookie get",event.cookies.getAll());

            const authCookies = JSON.parse(event.cookies.get('auth'));

            console.log("authCookies", authCookies);
            // console.log("email", authCookies.email);

            // Get the user
            // const response = await login(authCookies.email);
            // console.log("login", response);

            const response = {role: "BUSINESS_ADMIN"};

            event.cookies.set('userInfo', JSON.stringify(response), { path: '/', httpOnly: true, secure: true });
        }
        catch (err)
        {
            console.log("error", err);
            throw redirect(303,'/signup');
        }

        // No user login


        //return new Response('custom response');
    }

    return await resolve(event);
}
