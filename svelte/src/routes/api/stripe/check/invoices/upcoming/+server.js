import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(SECRET_STRIPE_KEY);

export async function POST({ request }) {
    try {
        const { customerId } = await request.json();

        // Retrieve the active subscriptions for the customer
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1,
        });

        if (subscriptions.data.length === 0) {
            return new Response(JSON.stringify({ error: "No active subscriptions found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const subscriptionId = subscriptions.data[0].id;

        // Retrieve the upcoming invoice for the subscription
        const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
            customer: customerId,
            subscription: subscriptionId,
        });

        return new Response(JSON.stringify({ upcomingInvoice }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error retrieving upcoming invoice:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
