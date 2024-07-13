import Stripe from 'stripe';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

export async function POST({ request }) {
    try {
        const { customerId, startOfMonth, endOfMonth } = await request.json();

        let invoices = [];
        let hasMore = true;
        let startingAfter = null;

        while (hasMore) {
            const params = {
                customer: customerId,
                limit: 100,
                created: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                }
            };

            if (startingAfter) {
                params.starting_after = startingAfter;
            }

            const response = await stripe.invoices.list(params);

            invoices = invoices.concat(response.data);
            hasMore = response.has_more;
            if (hasMore) {
                startingAfter = response.data[response.data.length - 1].id;
            }

        }

        return new Response(JSON.stringify({ invoices }), {
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
