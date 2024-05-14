import {redirect} from "@sveltejs/kit";

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

            // Get the user
            //const response =
        }
        catch (err)
        {
            throw redirect(303,'/signup');
        }

        // No user login


        //return new Response('custom response');
    }

    const response = await resolve(event);
    return response;
}
