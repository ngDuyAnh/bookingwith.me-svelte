<script>
  import { selectedTab } from "$lib/page/protected/business-portal/page_business_admin/stores/selected_tab_store.js";
  import Header from "$lib/page/protected/business-portal/components/Header/Header.svelte";
  import Dashboard from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Dashboard.svelte";
  import Report from "$lib/page/protected/business-portal/page_business_admin/page/Report/Report.svelte";
  import Employee from "$lib/page/protected/business-portal/page_business_admin/page/Employee/Employee.svelte";
  import Service from "$lib/page/protected/business-portal/page_business_admin/page/Service/Service.svelte";
  import Setting from "$lib/page/protected/business-portal/page_business_admin/page/Setting/Setting.svelte";

  let tabs = ["Dashboard", "Report", "Employee", "Service", "Setting"];
  selectedTab.set(tabs[2]);

</script>

<Header {tabs} {selectedTab} />

<div class="m-1">
  {#if $selectedTab === "Dashboard"}
    <Dashboard />
  {:else if $selectedTab === "Report"}
    <Report />
  {:else if $selectedTab === "Employee"}
    <Employee />
  {:else if $selectedTab === "Service"}
    <Service />
  {:else if $selectedTab === "Setting"}
    <Setting />
  {/if}
</div>