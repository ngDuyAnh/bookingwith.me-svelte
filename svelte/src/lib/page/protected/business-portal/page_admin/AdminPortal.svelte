<script>
  import Header from "$lib/page/protected/components/Header/Header.svelte";
  import CreateBusiness from "$lib/page/protected/business-portal/page_admin/page/CreateBusiness/CreateBusiness.svelte";
  import Setting from "$lib/page/protected/business-portal/page_admin/page/Setting/Setting.svelte";

  let tabs = ["Create Business", "Setting"];
  let selectedIndex = 0;
</script>

<Header
        {tabs}
        bind:selectedIndex={selectedIndex}
/>

<div class="m-1">
  {#if selectedIndex === 0}
    <CreateBusiness />
  {:else if selectedIndex === 1}
    <Setting/>
  {/if}
</div>
