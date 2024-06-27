<script>
    import Dashboard from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Dashboard.svelte";
    import Metrics from "$lib/page/protected/business-portal/page_business_admin/page/Metrics/Metrics.svelte";
    import Employee from "$lib/page/protected/business-portal/page_business_admin/page/Employee/Employee.svelte";
    import Service from "$lib/page/protected/business-portal/page_business_admin/page/Service/Service.svelte";
    import NavBar from "$lib/page/protected/components/NavBar/NavBar.svelte";

    let tabs = ["Dashboard", "Metrics", "Employee", "Service"];

    let dropdownOptions = {
        "Metrics": {
            "Service":["Usage Information", "Billing"],
        },
    }
    let selectedDropDownIndex=0;
    let selectedIndex = 0;
</script>

<NavBar
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
                bind:selectedIndex={selectedIndex}
                {tabs}
                {dropdownOptions}
        />
    {:else if selectedIndex === 1}
        <Metrics
                bind:selectedDropDownIndex={selectedDropDownIndex}
        />
    {:else if selectedIndex === 2}
        <Employee/>
    {:else if selectedIndex === 3}
        <Service/>
    {/if}
</div>
