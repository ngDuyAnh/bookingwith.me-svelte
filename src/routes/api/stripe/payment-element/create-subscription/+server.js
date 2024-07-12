import Stripe from 'stripe'
import {SECRET_STRIPE_KEY} from '$env/static/private'
import {StripeProductIDs} from "$lib/api/initialize_functions/Stripe.js";

const stripe = new Stripe(SECRET_STRIPE_KEY)

async function createSubscription(customerId, paymentMethodId) {
    // attach the Payment Method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // update the customer's invoice settings to use this payment method
    await stripe.customers.update(customerId, {
        invoice_settings: {
            default_payment_method: paymentMethodId,
        },
    });

    // create the subscription
    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
            { price: StripeProductIDs.LOBBY },
            { price: StripeProductIDs.ONLINE },
            { price: StripeProductIDs.SMS },
        ],
        collection_method: "charge_automatically",
        currency: "cad",
    });

    console.log("subscription ", subscription);
    console.log("subscription ID ", subscription.id);

    return subscription;
}

// Your server-side POST handler to create a subscription
export async function POST({ request }) {
    try {
        const { customerId, paymentMethodId } = await request.json();
        const subscription = await createSubscription(customerId, paymentMethodId);

        return new Response(JSON.stringify({ subscriptionId: subscription.id}), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
