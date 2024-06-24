<script>
    import MyTimetable from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/MyTimetable.svelte";
    import UpcomingService
        from "$lib/page/protected/business-portal/page_employee/page/UpcomingService/UpcomingService.svelte";
    import NavBar from "$lib/page/protected/components/NavBar/NavBar.svelte";

    let tabs = ["Service Spotlight", "My Timetable"];
    let selectedIndex = 0;

</script>

<div class="flex flex-col h-screen overflow-hidden z-[1006]">
    <NavBar
            bind:selectedIndex={selectedIndex}
            bind:tabs={tabs}
    />

    {#if selectedIndex === 0}
        <UpcomingService/>
    {:else if selectedIndex === 1}
        <MyTimetable/>
    {/if}
</div>
