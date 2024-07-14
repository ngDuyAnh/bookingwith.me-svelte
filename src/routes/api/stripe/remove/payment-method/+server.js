import Stripe from 'stripe';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export async function POST({ request }) {
    try {
        const { paymentMethodId } = await request.json();

        // Detach the existing payment method
        const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

        return new Response(JSON.stringify({ paymentMethod }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error detaching payment method:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}