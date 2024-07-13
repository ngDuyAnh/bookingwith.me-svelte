import Stripe from 'stripe';
import { PRIVATE_STRIPE_KEY } from '$env/static/private';

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

async function findOrCreateCustomer(email, name) {
    try {
        // Retrieve customers with the same email
        const customers = await stripe.customers.list({
            email: email,
            limit: 10 // Adjust the limit based on expected use case
        });

        // Check if any retrieved customers match the given name
        const existingCustomer = customers.data.find(customer => customer.name === name);

        if (existingCustomer) {
            console.log("Existing customer found: ", existingCustomer.id);
            return existingCustomer; // Return the existing customer if found
        } else {
            // No matching customer found, create a new one
            const newCustomer = await stripe.customers.create({
                email: email,
                name: name
            });
            console.log("New customer created: ", newCustomer.id);
            return newCustomer;
        }
    } catch (error) {
        console.error("Error in findOrCreateCustomer:", error);
        throw error;
    }
}

// Server-side POST handler to find or create a customer
export async function POST({ request }) {
    try {
        const { email, name } = await request.json();
        const customer = await findOrCreateCustomer(email, name);

        return new Response(JSON.stringify({ customerId: customer.id }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
