<script>
    import {onMount} from "svelte";
    import {getBusinessInformation} from "$lib/api/api_server/business-portal/api.js";
    import {businessInfo} from "$lib/page/protected/business-portal/page_business_admin/stores/business_portal_admin_store.js";
    import {selectedTab} from "$lib/page/protected/business-portal/page_lobby/stores/selected_tab_store.js";
    import {Spinner} from "flowbite-svelte";
    import Header from "$lib/page/protected/business-portal/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/Dashboard.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_lobby/page/Timetable/Timetable.svelte";
    import CreateBooking from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/CreateBooking.svelte";
    import BookingList from "$lib/page/protected/business-portal/page_lobby/page/BookingList/BookingList.svelte";
    import {
        employeeSelectOptions, employeeToSelectOption
    } from "$lib/page/stores/EmployeeSelectOptions/employeeSelectOptions_store.js";
    import {goto} from "$app/navigation";
    import {userProfile} from "$lib/page/protected/stores/userProfile.js";

    let isLoading = true;
    let tabs = ['Dashboard', 'Timetable', 'Create', "List"];
    selectedTab.set(tabs[0]);

    onMount(async () => {
        // Get business info
        try {
            const response = await getBusinessInformation($userProfile.businessId);

            console.log("/protected/business-portal/admin response ", response);

            businessInfo.set(response); // Set fetched data to the store

            // The business is not active
            // Send to error page
            if (!$businessInfo.business.active)
            {
                await goto('/error');
            }

            // Convert the employee list to selectable options
            if ($businessInfo.employeeList && Array.isArray($businessInfo.employeeList))
            {
                employeeSelectOptions.set($businessInfo.employeeList.map(employeeToSelectOption));
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

<div class="flex flex-col h-screen overflow-hidden">
    <Header {tabs} {selectedTab}/>

    {#if isLoading}
        <div class="flex justify-center items-center min-h-screen">
            <Spinner />
        </div>
    {:else}
        {#if $selectedTab === tabs[0]}
            <Dashboard />
        {:else if $selectedTab === tabs[1]}
            <Timetable />
        {:else if $selectedTab === tabs[2]}
            <CreateBooking />
        {:else if $selectedTab === tabs[3]}
            <BookingList />
        {/if}
    {/if}
</div>
