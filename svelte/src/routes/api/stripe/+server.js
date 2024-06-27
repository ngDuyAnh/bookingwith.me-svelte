import {PUBLIC_STRIPE_KEY, SECRET_STRIPE_KEY} from '$env/static/private';
import Stripe from 'stripe';

const stripe = new Stripe(SECRET_STRIPE_KEY);

export async function POST({ request }) {
    try {
        const { customerId } = await request.json();

        const lobbyMeterEvent = await stripe.billing.meterEvents.create({
            event_name
                : 'lobby_booking',
            payload
                : {
                stripe_customer_id: customerId,
                value: '25',
            },

        });

        const onlineMeterEvent = await stripe.billing.meterEvents.create({
            event_name
                : 'online_booking',
            payload
                : {
                stripe_customer_id: customerId,
                value: '25',
            },

        });

        const smsMeterEvent = await stripe.billing.meterEvents.create({
            event_name
                : 'sms',
            payload
                : {
                stripe_customer_id: customerId,
                value: '25',
            },

        });

        console.log("lobbyMeterEvent ",lobbyMeterEvent);
        console.log("onlineMeterEvent ",onlineMeterEvent);
        console.log("smsMeterEvent ",smsMeterEvent);


        return new Response(JSON.stringify({lobbyMeterEvent ,onlineMeterEvent ,smsMeterEvent}), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// export async function POST({request})
// {
//     const stripe = require('stripe')(SECRET_STRIPE_KEY);
//
//     const meterEvent = await stripe.billing.meterEvents.create({
//         event_name
//             : 'alpaca_ai_tokens',
//         payload
//             : {
//             stripe_customer_id: '{{CUSTOMER_ID}}',
//             value: '25',
//         },
//     });
//
//     console.log("meterEvent ",meterEvent);
//
//     return new Response(JSON.stringify({meterEvent}), {status: 200});
// }
