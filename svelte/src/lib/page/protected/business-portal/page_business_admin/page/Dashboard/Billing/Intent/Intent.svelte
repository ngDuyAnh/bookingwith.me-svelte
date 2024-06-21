<script>
    import {onMount} from "svelte";
    import {PUBLIC_STRIPE_KEY} from '$env/static/public';
    import {loadStripe} from "@stripe/stripe-js";
    import {Address, Elements, PaymentElement} from 'svelte-stripe';
    import {Button, Spinner} from "flowbite-svelte";

    let stripe;
    let elements;
    let clientSecret;

    let subscribed=false;


    export let customerId;
    export let hasSubscribed;

    let paymentMethodId = null;


    async function setupStripe() {
        stripe = await loadStripe(PUBLIC_STRIPE_KEY);

        const response = await fetch('/stripe/payment-element/setup-intent', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({customerId: customerId}),
        });

        const result = await response.json();
        clientSecret = result.clientSecret;
    }

    async function createSubscription() {
        try {
            const response = await fetch('/stripe/payment-element/create-subscription', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    customerId: customerId,
                    paymentMethodId: paymentMethodId
                })
            })
            const {subscriptionId} = await response.json();
            console.log("subscriptionId", subscriptionId);

            hasSubscribed=true;

        } catch (error) {
            console.log("error", error);
            subscribed=false;
        }
    }

    onMount(async () => {
        await setupStripe();
    });

    async function handleSubmit(event) {
        subscribed=true;
        event.preventDefault();

        const {setupIntent, error} = await stripe.confirmSetup({
            elements,
            redirect: 'if_required'
        });

        if (error) {
            console.error(error);
            subscribed=false;
        } else {
            console.log('SetupIntent success:', setupIntent);
            paymentMethodId = setupIntent.payment_method;
            await createSubscription();
        }
    }



</script>

{#if clientSecret}
    <form id="payment-form" on:submit|preventDefault={handleSubmit} class="w-fit rounded-lg border-2 p-2 bg-[#F6F5F8] ">
        <Elements {stripe} {clientSecret} bind:elements >
            <Address mode="billing"/>
            <PaymentElement/>
        </Elements>

        <Button disabled={subscribed} type="submit" class="w-full m-auto">Subscribe</Button>
        <div class="flex flex-col items-center justify-center">
            <div class="stripe-branding text-xs">
                <p>Powered by <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</a></p>
                <p class="flex justify-evenly">
                    <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Terms</a> |
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
                </p>
            </div>
        </div>
    </form>
{:else}
    <Spinner/>
{/if}

