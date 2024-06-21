<script context="module">
    export const ssr = false; // Disable server-side rendering for this route
</script>

<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/Dashboard.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_lobby/page/Timetable/Timetable.svelte";
    import BookingList from "$lib/page/protected/business-portal/page_lobby/page/BookingList/BookingList.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import SendReview from "$lib/page/protected/business-portal/page_lobby/page/SendReview/SendReview.svelte";
    // import { customerBookings, updateBookings} from "$lib/page/stores/testHook/booking.js";
    import {io} from 'socket.io-client';

    let tabs = ['Dashboard', 'Timetable', "List", "Send review", "Setting"];
    let selectedIndex = 0;

    const socket = io();

    socket.on('eventFromServer', (message)=>{
        console.log(message);
    })

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
        <SendReview/>
    {:else if selectedIndex === 4}
        <Setting />
    {/if}
</div>
