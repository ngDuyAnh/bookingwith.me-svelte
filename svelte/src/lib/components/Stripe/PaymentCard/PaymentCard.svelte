<script>
    import {onMount} from 'svelte';
    import {Button, Card, Modal, Spinner} from 'flowbite-svelte';
    import {loadStripe} from '@stripe/stripe-js';
    import {PUBLIC_STRIPE_KEY} from '$env/static/public';
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";
    import {Address, Elements, PaymentElement} from 'svelte-stripe';

    export let paymentMethod;

    let showModal = false;
    let stripe;
    let elements;
    let clientSecret;
    let saved;
    let success = false;

    const customerId = $userProfile.user.businessInfo.stripeID;

    onMount(async () => {
        stripe = await loadStripe(PUBLIC_STRIPE_KEY);
    });

    async function openModal() {
        showModal = true;
        clientSecret = undefined;
        elements = undefined;

        try {
            await setupStripe();
        } catch (error) {
            console.error("error", error);
        }
    }

    async function setupStripe() {
        const response = await fetch('/stripe/payment-element/setup-intent', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({customerId: customerId}),
        });

        const result = await response.json();

        clientSecret = result.clientSecret;

        console.log("result", result);
        console.log("clientSecret", clientSecret);
    }

    async function handlePaymentMethodChange(event) {
        try {
            saved = true;
            event.preventDefault();

            const {setupIntent, error} = await stripe.confirmSetup({
                elements,
                redirect: 'if_required'
            });

            if (error) {
                console.error(error);
                saved = false;
                return;
            }

            // Detach the old payment method
            await fetch('/stripe/remove/payment-method', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({paymentMethodId: paymentMethod.id}),
            });

            // Attach the new payment method
            await fetch('/stripe/payment-element/payment-method', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({customerId, paymentMethodId: setupIntent.payment_method}),
            });

            // Fetch and update the new payment method details
            const response = await fetch('/stripe/check/payment-method', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({customerId}),
            });

            const result = await response.json();
            paymentMethod = result.paymentMethod;

            // Close the modal
            //show success
            success = true;
        } catch (error) {
            console.error("Error updating payment method:", error);
        }
    }

    $:console.log("showModal", showModal);
</script>

<Card>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Current Payment Method</h5>
    <p class="font-normal text-gray-700 dark:text-gray-400"><strong>Name:</strong> {paymentMethod.billing_details.name}
    </p>
    <p class="font-normal text-gray-700 dark:text-gray-400"><strong>Brand:</strong> {paymentMethod.card.brand}</p>
    <p class="font-normal text-gray-700 dark:text-gray-400"><strong>Last 4 Digits:</strong> {paymentMethod.card.last4}
    </p>
    <p class="font-normal text-gray-700 dark:text-gray-400"><strong>Expiry:</strong> {paymentMethod.card.exp_month}
        /{paymentMethod.card.exp_year}</p>
    <Button class="mt-4" bind:disabled={showModal} on:click={openModal}>Change Payment Method</Button>
</Card>

<Modal bind:open={showModal} on:close={() => showModal = false}>
    <div slot="header" class="w-full flex justify-center items-center">
        <h5 class="text-xl font-medium text-gray-900 dark:text-white">Change Payment Method</h5>
    </div>
    <div class="w-full flex justify-center">
        {#if !success}
            {#if clientSecret}
                <form id="payment-form" on:submit|preventDefault={handlePaymentMethodChange}
                      class="w-fit p-2">
                    <Elements {stripe} {clientSecret} bind:elements>
                        <Address mode="billing"/>
                        <PaymentElement/>
                    </Elements>

                    <Button disabled={saved} type="submit" class="w-full m-auto">Save</Button>
                </form>
            {:else}
                <Spinner/>
            {/if}
        {:else}
            <svg class="animate-pop-open text-gray-800 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="rgba(80,180,80,1)"
                 viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                      clip-rule="evenodd"/>
            </svg>
        {/if}
    </div>
    <div slot="footer" class="w-full flex justify-center">
        <div class="flex flex-col items-center justify-center">
            <div class="stripe-branding text-xs">
                <p>Powered by <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</a></p>
                <p class="flex justify-evenly">
                    <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer">Terms</a> |
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
                </p>
            </div>
        </div>
    </div>
</Modal>
