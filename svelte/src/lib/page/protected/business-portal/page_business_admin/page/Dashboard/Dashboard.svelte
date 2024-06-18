<script>
    import BookingCost
        from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/BookingCost/BookingCost.svelte";
    import Billing from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Billing/Billing.svelte";

    export let selectedDropDownIndex;

</script>

{#if selectedDropDownIndex == 0}
    <BookingCost/>
{:else if selectedDropDownIndex == 1}
    <Billing/>
{/if}