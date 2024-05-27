<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/Dashboard.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_lobby/page/Timetable/Timetable.svelte";
    import BookingList from "$lib/page/protected/business-portal/page_lobby/page/BookingList/BookingList.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import {business} from "$lib/page/protected/stores/business.js";
    import ModalEditCustomerBooking from "$lib/components/Modal/EditCustomerBooking/ModalEditCustomerBooking.svelte";

    let tabs = ['Dashboard', 'Timetable', "List", "Setting"];
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
        <BookingList />
    {:else if selectedIndex === 3}
        <Setting />
    {/if}
</div>

<!-- Modal for edit customer booking -->
<ModalEditCustomerBooking
        business={$business}
/>
