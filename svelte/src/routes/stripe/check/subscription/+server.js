import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';
import { StripeProductIDs } from "$lib/api/initialize_functions/Stripe.js";

const stripe = new Stripe(SECRET_STRIPE_KEY);


export async function POST({ request }) {
    try {
        const { customerId } = await request.json();

        // Check if the customer is already subscribed
        const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'active' });

        if (subscriptions.data.length > 0) {
            // Customer is already subscribed
            return new Response(JSON.stringify({ message: "Customer is already subscribed" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ subscriptionId: subscription.id }), {
            status:
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error checking subscription details:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
