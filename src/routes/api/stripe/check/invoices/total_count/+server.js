import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(SECRET_STRIPE_KEY);

export async function POST({ request }) {
    try {
        const { customerId } = await request.json();

        const ret = await stripe.invoices.list(
            {
                customer: customerId,
                expand: ["total_count"],
                limit: 0,
            });

        console.log("total is", ret.total_count)

        return new Response(JSON.stringify({ invoiceTotal: ret.total_count }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error retrieving invoices:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
