<script>
    import Intent
        from "$lib/page/protected/business-portal/page_business_admin/page/Metrics/Billing/Intent/Intent.svelte";
    import Subscribed
        from "$lib/page/protected/business-portal/page_business_admin/page/Metrics/Billing/Subscribed/Subscribed.svelte";
    import ShowPlan
        from "$lib/page/protected/business-portal/page_business_admin/page/Metrics/Billing/ShowPlan/ShowPlan.svelte";
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";
    import {onMount} from "svelte";
    import {Spinner} from "flowbite-svelte";
    import Card from "$lib/components/Stripe/PaymentCard/PaymentCard.svelte";
    import PastInvoice from "$lib/components/Stripe/PastInvoice/PastInvoice.svelte";
    import Subscription
        from "$lib/page/protected/business-portal/page_business_admin/page/Metrics/Billing/Subscription/Subscription.svelte";
    import {businessInfo} from "$lib/page/customer-booking-portal/create/stores/customer_booking_portal_create_store.js";

    $:console.log("userProfile userProfile", $userProfile);
    $:console.log("businessInfo businessInfo", $businessInfo);

    let hasStripeAccount = false;
    let hasSubscribed = false;
    let hasPaymentMethod = false;
    let loading = true;
    let customerId = null;

    async function subscribed() {

        const response = await fetch('/api/stripe/check/subscription', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({customerId: customerId}),
        });

        const result = await response.json();

        hasSubscribed = result.subscribed;
    }

    let paymentMethod = null;

    async function checkPaymentMethod() {
        const response = await fetch('/api/stripe/check/payment-method', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({customerId}),
        });

        const result = await response.json();
        console.log("paymentMethods result", result);
        if (result.hasPaymentMethod == true) {
            hasPaymentMethod = true;
            paymentMethod = result.paymentMethod;
        } else if (result.hasPaymentMethod == false) {
            hasPaymentMethod = false;
        } else if (result.error) {
            console.error(result.error);
        }
    }

    $:console.log("customerId", customerId);
    $:console.log("hasSubscribed", hasSubscribed);
    onMount(async () => {
        if ($userProfile.user.businessInfo.stripeID) {
            customerId = $userProfile.user.businessInfo.stripeID;
            hasStripeAccount = true;
        }

        await subscribed();
        await checkPaymentMethod();

        loading = false;

    })

    let subscriptionStep = 0;
    let paymentMethodId = null;
</script>

<div class="p-2 flex flex-col justify-center items-center space-y-3">
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-2">Service Billing</h1>
    {#if loading}
        <Spinner/>
    {:else}
        {#if !hasStripeAccount}
            <span class="text-red-800">No billing stripe account has been attached to this account, contact bookingwith.me to resolve.</span>
        {:else}
            {#if !hasSubscribed}
                <span>No Active Subscription To bookingwith.me</span>

                {#if hasPaymentMethod}
                    <Card
                            bind:paymentMethod={paymentMethod}
                    />
                    {#if subscriptionStep == 0}
                        <ShowPlan
                                bind:subscriptionStep={subscriptionStep}
                        />
                    {:else if subscriptionStep == 1}
                        <Subscription
                                bind:customerId={customerId}
                                bind:subscriptionStep={subscriptionStep}
                                bind:paymentMethodId={paymentMethod.id}
                                bind:hasSubscribed={hasSubscribed}
                        />
                    {/if}
                    <PastInvoice
                            {customerId}
                    />
                {:else}
                    {#if subscriptionStep == 0}
                        <ShowPlan
                                bind:subscriptionStep={subscriptionStep}
                        />
                    {:else if subscriptionStep == 1}
                        <Intent
                                bind:customerId={customerId}
                                bind:hasSubscribed={hasSubscribed}
                        />
                    {/if}
                {/if}
            {:else}
                <Subscribed
                        bind:customerId={customerId}
                        bind:paymentMethod={paymentMethod}
                />
            {/if}
        {/if}
    {/if}
</div>