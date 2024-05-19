<script>
    import {selectedTab} from "$lib/page/protected/business-portal/page_lobby/stores/selected_tab_store.js";
    import Header from "$lib/page/protected/business-portal/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/Dashboard.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_lobby/page/Timetable/Timetable.svelte";
    import CreateBooking from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/CreateBooking.svelte";
    import BookingList from "$lib/page/protected/business-portal/page_lobby/page/BookingList/BookingList.svelte";

    let tabs = ['Dashboard', 'Timetable', 'Create', "List"];
    selectedTab.set(tabs[0]);
</script>

<div class="flex flex-col h-screen overflow-hidden">
    <Header {tabs} {selectedTab}/>

    {#if $selectedTab === tabs[0]}
        <Dashboard />
    {:else if $selectedTab === tabs[1]}
        <Timetable />
    {:else if $selectedTab === tabs[2]}
        <CreateBooking />
    {:else if $selectedTab === tabs[3]}
        <BookingList />
    {/if}
</div>
