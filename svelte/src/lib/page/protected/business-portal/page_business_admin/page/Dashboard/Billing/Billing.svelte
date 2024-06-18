<script>
    import Intent
        from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Billing/Intent/Intent.svelte";
    import Subscription
        from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Billing/Subscription/Subscription.svelte";
    import Subscribed
        from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Billing/Subscribed/Subscribed.svelte";
    import ShowPlan
        from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Billing/ShowPlan/ShowPlan.svelte";


    // let usage = {lobby: 0, online: 0, sms: 0};
    const customerId = {
        ROBA1: "cus_QIMtNH2bgSMOVs",
        ROBA2: "cus_QIfcLYle5X567a"
    }

    let subscriptionStep = 0;
    let paymentMethodId=null;
</script>

<div class="p-2 flex flex-col justify-center items-center ">
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-2">Billing Portal</h1>
    {#if subscriptionStep == 0}
        <ShowPlan
                bind:subscriptionStep={subscriptionStep}
        />
    {:else if subscriptionStep == 1}
        <Intent
                bind:subscriptionStep={subscriptionStep}
                bind:paymentMethodId={paymentMethodId}
        />

<!--        <Subscription-->
<!--                bind:subscriptionStep={subscriptionStep}-->
<!--                bind:paymentMethodId={paymentMethodId}-->
<!--        />-->
    {:else if subscriptionStep == 2}
        <Subscribed
        />
    {/if}
</div>