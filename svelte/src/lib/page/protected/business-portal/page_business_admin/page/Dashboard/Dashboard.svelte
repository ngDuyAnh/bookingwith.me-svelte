<script>
    import UsageInformation
        from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/UsageInformation/UsageInformation.svelte";
    import Billing from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Billing/Billing.svelte";

    export let selectedDropDownIndex;

</script>

{#if selectedDropDownIndex == 0}
    <UsageInformation/>
{:else if selectedDropDownIndex == 1}
    <Billing/>
{/if}