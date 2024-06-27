<script>
    import {loadStripe} from '@stripe/stripe-js'
    import {onMount} from 'svelte'
    import {PUBLIC_STRIPE_KEY} from '$env/static/public'
    import {Button, Spinner} from "flowbite-svelte";


    let usage = {lobby: 4, online: 3, sms: 2};
    export let customerId;
    export let subscriptionStep;
    export let paymentMethodId;
    export let hasSubscribed;

    async function createSubscription() {
        create=true;
        try {
            const response = await fetch('/api/stripe/payment-element/create-subscription', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    customerId: customerId,
                    paymentMethodId: paymentMethodId
                })
            })
            // const {subscriptionId} = await response.json();

            // subscriptionID = subscriptionId;
            subscriptionStep=2;

            hasSubscribed=true;

            // console.log("subscriptionId", subscriptionId);
        } catch (error) {
            console.log("error", error);
        }
        create=false;
    }

    let loading = true;
    let create;
    onMount(async () => {
        create=false;
        loading = false;
    })


    $:console.log("customer usage inc", usage);
</script>

<div class="p-2 flex flex-col justify-center items-center ">

    {#if loading}
        <Spinner/>
    {:else}

        <div class="flex flex-col items-center space-y-2">

            <Button bind:disabled={create} on:click={()=>createSubscription()}>
                Purchase Service
            </Button>
        </div>
    {/if}
</div>
