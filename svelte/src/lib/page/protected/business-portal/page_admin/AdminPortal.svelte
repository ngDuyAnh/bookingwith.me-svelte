<script>
  import { selectedTab } from "$lib/page/protected/business-portal/page_admin/stores/selected_tab_store.js";
  import Header from "$lib/page/protected/business-portal/components/Header/Header.svelte";
  import CreateBusiness from "$lib/page/protected/business-portal/page_admin/page/CreateBusiness/CreateBusiness.svelte";
  import Setting from "$lib/page/protected/business-portal/page_admin/page/Setting/Setting.svelte";

  let tabs = ["Create Business", "Setting"];
  selectedTab.set(tabs[0]);
</script>

<Header {tabs} {selectedTab} />

<div class="m-1">
  {#if $selectedTab === "Create Business"}
    <CreateBusiness />
  {:else if $selectedTab === "Setting"}
    <Setting/>
  {/if}
</div>
