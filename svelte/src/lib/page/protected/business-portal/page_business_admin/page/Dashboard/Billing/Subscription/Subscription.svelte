<script>
    import {loadStripe} from '@stripe/stripe-js'
    import {Elements, PaymentElement} from 'svelte-stripe'
    import {onMount} from 'svelte'
    import {PUBLIC_STRIPE_KEY} from '$env/static/public'
    import {Button, Card, Spinner} from "flowbite-svelte";
    import dinero from "dinero.js";
    import {CustomerBookingCost} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {CheckCircleSolid} from "flowbite-svelte-icons";


    let usage = {lobby: 4, online: 3, sms: 2};
    export let subscriptionStep;
    export let paymentMethodId;

    const customerId = {
        ROBA1: "cus_QIMtNH2bgSMOVs",
        ROBA2: "cus_QIfcLYle5X567a"
    }

    let stripe = null;
    let clientSecret = null;
    let subscriptionID = null;
    let error = null;
    let elements;
    let processing = false;
    let purchased = false;
    const customerName={
        ROBA1: "Roba Testing",
        ROBA2: "Roba 2"
    }

    async function createSubscription() {
        try {
            const response = await fetch('/stripe/payment-element/create-subscription', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    customerId: customerId.ROBA1,
                    paymentMethodId: paymentMethodId
                })
            })
            const {subscriptionId} = await response.json();

            subscriptionID = subscriptionId;
            subscriptionStep=2;

            console.log("subscriptionId", subscriptionId);
        } catch (error) {
            console.log("error", error);
        }
    }

    let loading = true;
    onMount(async () => {
        stripe = await loadStripe(PUBLIC_STRIPE_KEY)

        // clientSecret = await createPaymentIntent();
        loading = false;
    })


    async function reportUsage() {
        const response = await fetch('/stripe/reportUsage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: customerId.ROBA1,
                usage: usage
            })
        });

        console.log("response", response);
    }

    $:console.log("customer usage inc", usage);
</script>

<div class="p-2 flex flex-col justify-center items-center ">

    <Card padding="xl">
        <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Standard Plan</h5>
        <div class="flex items-baseline text-gray-900 dark:text-white">
            <span class="text-3xl font-semibold">$</span>
            <span class="text-5xl font-extrabold tracking-tight">0</span>
            <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
        </div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Monthly subscription with pay-as-you-go pricing</p>
        <ul class="my-7 space-y-4">
            <li class="flex space-x-2 rtl:space-x-reverse">
                <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                <span class="text-sm font-normal leading-tight text-gray-500 dark:text-gray-400">{dinero({amount: CustomerBookingCost.LOBBY, currency: 'CAD'}).toFormat('$0,0.00')} per Lobby Booking</span>
            </li>
            <li class="flex space-x-2 rtl:space-x-reverse">
                <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                <span class="text-sm font-normal leading-tight text-gray-500 dark:text-gray-400">{dinero({amount: CustomerBookingCost.ONLINE, currency: 'CAD'}).toFormat('$0,0.00')} per Online Booking</span>
            </li>
            <li class="flex space-x-2 rtl:space-x-reverse">
                <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                <span class="text-sm font-normal leading-tight text-gray-500 dark:text-gray-400">{dinero({amount: CustomerBookingCost.SMS, currency: 'CAD'}).toFormat('$0,0.00')} per SMS sent</span>
            </li>
        </ul>
        <Button class="w-full">Subscribe Now</Button>
    </Card>





    {#if purchased}
        <h1>Purchased service.</h1>
    {/if}

    {#if loading}
        <Spinner/>
    {:else}

        <div class="flex flex-col items-center space-y-2">
            {#if error}
                <p class="error">{error.message} Please try again.</p>
            {/if}


            <Button on:click={createSubscription}>
                Purchase Service
            </Button>

            <div class="flex flex-row items-center space-x-2">
                <Button on:click={()=>{usage.lobby++;}}>
                    +Lobby
                </Button>
                <Button on:click={()=>{usage.online++;}}>
                    +Online
                </Button>
                <Button on:click={()=>{usage.sms++;}}>
                    +SMS
                </Button>
            </div>

            <Button on:click={reportUsage}>
                Report Usage
            </Button>
        </div>
    {/if}
</div>
