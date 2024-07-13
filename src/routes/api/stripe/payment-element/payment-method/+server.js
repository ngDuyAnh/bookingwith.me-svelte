import Stripe from 'stripe';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export async function POST({ request }) {
    try {
        const { customerId, paymentMethodId } = await request.json();

        // Attach the new payment method to the customer
        const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });

        // Update the customer's invoice settings to use this payment method by default
        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        return new Response(JSON.stringify({ paymentMethod }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error attaching payment method:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
