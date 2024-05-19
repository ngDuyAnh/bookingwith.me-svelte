<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Setting from "$lib/page/protected/business-portal/page_employee/page/Setting/Setting.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_employee/page/Timetable/Timetable.svelte";

    let tabs = ["Dashboard", "Setting"];
    let selectedIndex = 0;
</script>

<Header
        {tabs}
        bind:selectedIndex={selectedIndex}
/>

<div class="m-1">
    {#if selectedIndex === 0}
        <Timetable />
    {:else if selectedIndex === 1}
        <Setting />
    {/if}
</div>
