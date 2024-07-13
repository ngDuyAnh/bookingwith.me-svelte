import {PRIVATE_STRIPE_KEY} from '$env/static/private';
import Stripe from 'stripe';
import {StripeProductIDs} from "$lib/api/initialize_functions/Stripe.js";

const stripe = new Stripe(PRIVATE_STRIPE_KEY);

const eventNames = {
    LOBBY: "lobby_booking",
    ONLINE: "online_booking",
    SMS: "sms"
}

export async function POST({request}) {
    try {
        const {customerId, usage} = await request.json();

        console.log("usage req", usage);
        // const usage = usageRecords[customerId];
        const subscriptionItems = await stripe.subscriptions.list({
            customer: customerId,
        });
        console.log("subscriptionItems.data ", JSON.stringify(subscriptionItems.data));
        console.log("subscriptionItems.data[0].items", subscriptionItems.data[0].items);
        // console.log("subscriptionItems.data ", subscriptionItems.data.id);
        for (const item of subscriptionItems.data[0].items.data) {
            console.log("Item is ", item.price.id);
            let quantity = 0;

            console.log("item.price.id ", item.price.id);
            let event_name = "";
            switch (item.price.id) {
                case StripeProductIDs.LOBBY:
                    quantity = usage.lobby;
                    event_name = eventNames.LOBBY;
                    break;
                case StripeProductIDs.ONLINE:
                    quantity = usage.online;
                    event_name = eventNames.ONLINE;
                    break;
                case StripeProductIDs.SMS:
                    quantity = usage.sms;
                    event_name = eventNames.SMS;
                    break;
            }

            console.log("quantity is ", quantity);

            if (quantity > 0) {
                const meterEvent = await stripe.billing.meterEvents.create({
                    event_name: event_name,
                    payload: {
                        value: quantity,
                        stripe_customer_id: customerId,
                    },
                });

                console.log("meterEvent is ",meterEvent);

            }
        }

        return new Response(JSON.stringify({subscriptionItems}), {
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        console.error("error", error);
        return new Response(JSON.stringify({error: error.message}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
}