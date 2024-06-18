<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import MyTimetable from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/MyTimetable.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import UpcomingService
        from "$lib/page/protected/business-portal/page_employee/page/UpcomingService/UpcomingService.svelte";
    import {
        servicingTicketClickModal
    } from "$lib/components/TimeTable/TimetableModal/stores/servicingTicketClickModal.js";

    let tabs = ["Upcoming Service", "My Timetable", "Setting"];
    let selectedIndex = 0;

    $: if (selectedIndex !== 1) {
        servicingTicketClickModal.update(current => {
            return {...current, open: false};
        });
    }
</script>

<div class="flex flex-col h-screen overflow-hidden z-[1006]">
    <Header
            bind:selectedIndex={selectedIndex}
            {tabs}
    />

    {#if selectedIndex === 0}
        <UpcomingService/>
    {:else if selectedIndex === 1}
        <MyTimetable/>
    {:else if selectedIndex === 2}
        <Setting/>
    {/if}
</div>
