import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(SECRET_STRIPE_KEY);

export async function POST({ request }) {
    try {
        const { customerId } = await request.json();

        // Check if the customer has any payment methods
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
        });

        if (paymentMethods.data.length > 0) {

            console.log("paymentMethods",paymentMethods);

            // Customer has an existing payment method
            return new Response(JSON.stringify({
                hasPaymentMethod: true,
                paymentMethod: paymentMethods.data[0]
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            // Customer does not have a payment method
            return new Response(JSON.stringify({ hasPaymentMethod: false }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }


    } catch (error) {
        console.error("Error checking payment method:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
