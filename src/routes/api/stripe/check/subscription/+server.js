import Stripe from 'stripe';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export async function POST({ request }) {
    try {
        const { customerId } = await request.json();

        // Check if the customer has any active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
        });

        if (subscriptions.data.length > 0) {
            // Customer has an active subscription
            return new Response(JSON.stringify({ subscribed: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            // Customer does not have an active subscription
            return new Response(JSON.stringify({ subscribed: false }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error("Error checking subscription:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
