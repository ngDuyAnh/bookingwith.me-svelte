<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/Dashboard.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_lobby/page/Timetable/Timetable.svelte";
    import CreateBooking from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/CreateBooking.svelte";
    import BookingList from "$lib/page/protected/business-portal/page_lobby/page/BookingList/BookingList.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    let tabs = ['Dashboard', 'Timetable', 'Create', "List", "Setting"];
    let selectedIndex = 0;
</script>

<div class="flex flex-col h-screen overflow-hidden z-[1006]">
    <Header
            {tabs}
            bind:selectedIndex={selectedIndex}
    />

    {#if selectedIndex === 0}
        <Dashboard />
    {:else if selectedIndex === 1}
        <Timetable />
    {:else if selectedIndex === 2}
        <CreateBooking />
    {:else if selectedIndex === 3}
        <BookingList />
    {:else if selectedIndex === 4}
        <Setting />
    {/if}
</div>
