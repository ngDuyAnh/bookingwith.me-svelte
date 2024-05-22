<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Setting from "$lib/page/protected/business-portal/page_employee/page/Setting/Setting.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/Timetable.svelte";
    import AllTimeTables
        from "$lib/page/protected/business-portal/page_employee/page/AllTimeTables/AllTimeTables.svelte";

    let tabs = ["My MyTimetable", "All Timetables", "Setting"];
    let selectedIndex = 0;

</script>
<div class="flex flex-col h-screen overflow-hidden z-[1006]">
    <Header
            {tabs}
            bind:selectedIndex={selectedIndex}
    />

    {#if selectedIndex === 0}
        <Timetable/>
    {:else if selectedIndex === 1}
        <AllTimeTables/>
    {:else if selectedIndex === 2}
        <Setting/>
    {/if}
</div>
