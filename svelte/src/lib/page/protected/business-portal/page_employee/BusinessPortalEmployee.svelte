<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import MyTimetable from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/MyTimetable.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_lobby/page/Timetable/Timetable.svelte";

    let tabs = ["My Timetable", "All Timetables", "Setting"];
    let selectedIndex = 0;
</script>

<div class="flex flex-col h-screen overflow-hidden z-[1006]">
    <Header
            {tabs}
            bind:selectedIndex={selectedIndex}
    />

    {#if selectedIndex === 0}
        <MyTimetable/>
    {:else if selectedIndex === 1}
        <Timetable/>
    {:else if selectedIndex === 2}
        <Setting/>
    {/if}
</div>
