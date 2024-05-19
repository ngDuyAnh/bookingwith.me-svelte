<script>
    import {selectedTab} from "$lib/page/protected/business-portal/page_admin/stores/selected_tab_store.js";
    import Header from "$lib/page/protected/business-portal/components/Header/Header.svelte"
    import {onMount} from "svelte";
    import { Spinner } from 'flowbite-svelte';
    import CreateBusiness
        from "$lib/page/protected/business-portal/page_admin/page/CreateBusiness/CreateBusiness.svelte";

    let isLoading = true;
    let tabs = ['Create Business'];
    selectedTab.set(tabs[0]);

    onMount(async () => {
        try {
            isLoading = false;

        } catch (error) {
            console.error('error ', error);
            isLoading = false;
        }
    });
</script>

<Header {tabs} {selectedTab}/>

<div class="m-1">
    {#if isLoading}
        <div class="spinner-container">
            <Spinner />
        </div>
    {:else}
        {#if $selectedTab === 'Create Business'}
            <CreateBusiness />
        {/if}
    {/if}
</div>

<style>
    .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* This makes the spinner center vertically in the viewport */
    }
</style>
