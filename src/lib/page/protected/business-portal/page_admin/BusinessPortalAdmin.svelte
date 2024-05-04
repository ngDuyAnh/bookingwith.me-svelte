<script>
    import {selectedTab} from "$lib/page/protected/business-portal/page_admin/stores/selected_tab_store.js";
    import Header from "$lib/page/protected/business-portal/components/Header/Header.svelte"
    import Dashboard from "$lib/page/protected/business-portal/page_admin/page/Dashboard/Dashboard.svelte";
    import Report from "$lib/page/protected/business-portal/page_admin/page/Report/Report.svelte";
    import Employee from "$lib/page/protected/business-portal/page_admin/page/Employee/Employee.svelte";
    import Service from "$lib/page/protected/business-portal/page_admin/page/Service/Service.svelte";
    import {onMount} from "svelte";
    import {user} from "$lib/page/protected/stores/user.js";
    import {getBusinessInformation} from "$lib/api_server/business-portal/api.js";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import { Spinner } from 'flowbite-svelte';
    import {goto} from "$app/navigation";

    let isLoading = true;
    let tabs = ['Dashboard', 'Report', 'Employee', 'Service'];
    selectedTab.set(tabs[2]);

    let userProfile;
    $: userProfile = $user;

    onMount(async () => {
        try {
            const response = await getBusinessInformation(userProfile.businessId);

            console.log("/protected/business-portal/admin response ", response);

            businessInfo.set(response); // Set fetched data to the store

            // The business is not active
            // Send to error page
            if (!$businessInfo.business.active)
            {
                await goto('/error');
            }

            // Complete loading business information
            isLoading = false;

        } catch (error) {
            alert('Failed to fetch business info');
            console.error('Failed to fetch business info', error);
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
        {#if $selectedTab === 'Dashboard'}
            <Dashboard />
        {:else if $selectedTab === 'Report'}
            <Report />
        {:else if $selectedTab === 'Employee'}
            <Employee />
        {:else if $selectedTab === 'Service'}
            <Service />
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
