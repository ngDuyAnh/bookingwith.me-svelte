<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Dashboard.svelte";
    import Report from "$lib/page/protected/business-portal/page_business_admin/page/Report/Report.svelte";
    import Employee from "$lib/page/protected/business-portal/page_business_admin/page/Employee/Employee.svelte";
    import Service from "$lib/page/protected/business-portal/page_business_admin/page/Service/Service.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";

    let tabs = ["Dashboard", "Report", "Employee", "Service", "Setting"];
    let selectedIndex = 0;
</script>

<Header
        {tabs}
        bind:selectedIndex={selectedIndex}
/>

<div class="m-1">
    {#if selectedIndex === 0}
        <Dashboard/>
    {:else if selectedIndex === 1}
        <Report/>
    {:else if selectedIndex === 2}
        <Employee/>
    {:else if selectedIndex === 3}
        <Service/>
    {:else if selectedIndex === 4}
        <Setting/>
    {/if}
</div>
