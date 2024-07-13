import Stripe from 'stripe';
import {PRIVATE_STRIPE_KEY} from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export async function POST({ request }) {
    try {
        const { customerId } = await request.json();

        // Create a Setup Intent to collect card information
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId,
        });

        return new Response(JSON.stringify({ clientSecret: setupIntent.client_secret }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error creating setup intent:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}