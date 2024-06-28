<script>
  import CreateBusiness from "$lib/page/protected/business-portal/page_admin/page/CreateBusiness/CreateBusiness.svelte";
  import Setting from "$lib/components/Setting/Setting.svelte";
  import Businesses from "$lib/page/protected/business-portal/page_admin/page/Businesses/Businesses.svelte";
  import NavBar from "$lib/page/protected/components/NavBar/NavBar.svelte";

  let tabs = ["Businesses","Create Business", "Setting"];
  let selectedIndex = 0;
</script>

<NavBar
        {tabs}
        bind:selectedIndex={selectedIndex}
/>


<div class="m-1">
  {#if selectedIndex === 0}
    <Businesses/>
  {:else if selectedIndex === 1}
    <CreateBusiness />
  {:else if selectedIndex === 2}
    <Setting/>
  {/if}
</div>
