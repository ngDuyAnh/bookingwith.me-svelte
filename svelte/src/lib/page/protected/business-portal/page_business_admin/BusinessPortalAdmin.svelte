<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Dashboard.svelte";
    import Report from "$lib/page/protected/business-portal/page_business_admin/page/Report/Report.svelte";
    import Employee from "$lib/page/protected/business-portal/page_business_admin/page/Employee/Employee.svelte";
    import Service from "$lib/page/protected/business-portal/page_business_admin/page/Service/Service.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";

    let tabs = ["Dashboard", "Report", "Employee", "Service", "Setting"];
    let dropdownOptions = {
        "Dashboard":["Booking Service Cost","Billing"]
    }
    let selectedDropDownIndex=0;
    let selectedIndex = 0;
</script>

<Header
        bind:selectedIndex={selectedIndex}
        bind:tabs={tabs}
        dropdown={true}
        dropdownOptions={dropdownOptions}
        bind:selectedDropDownIndex={selectedDropDownIndex}
/>

<div class="m-1">
    {#if selectedIndex === 0}
        <Dashboard
                bind:selectedDropDownIndex={selectedDropDownIndex}
        />
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
