<script>
    //Reports: Generate reports to analyze booking trends, customer frequency, revenue generated, and other metrics. This can help in making informed business decisions.
    import UsageInformation
        from "$lib/page/protected/business-portal/page_business_admin/page/Metrics/UsageInformation/UsageInformation.svelte";
    import Billing from "$lib/page/protected/business-portal/page_business_admin/page/Metrics/Billing/Billing.svelte";

    export let selectedDropDownIndex;
</script>

{#if selectedDropDownIndex == 0}
    <UsageInformation/>
{:else if selectedDropDownIndex == 1}
    <Billing/>
{/if}