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
    import {onDestroy, onMount} from "svelte";
    import {business} from "../../../stores/business/business.js";

    let tabs = ['Dashboard', 'Timetable', "List", "Send review", "Setting"];
    let selectedIndex = 0;



    let eventSource;

    function connectSSE() {
        if (eventSource) {
            eventSource.close(); // Ensure the old connection is closed before creating a new one
        }

        const businessId = $business.businessInfo.businessID; // Make sure this reactive variable is accessed correctly
        eventSource = new EventSource(`https://api-debug.bookingwith.me/sse/stream-sse/${businessId}`);

        eventSource.addEventListener('business', function(event) {
            const updatedBusiness = JSON.parse(event.data);
            business.set(updatedBusiness);
            console.log('Business updated:', updatedBusiness);
        });

        eventSource.onerror = function(error) {
            console.error("Error. Trying to reconnect.");
            eventSource.close();
            setTimeout(connectSSE, 1000); // Reconnect logic
        };
    }

    onMount(() => {
        connectSSE();

        window.addEventListener('beforeunload', () => {
            if (eventSource) {
                eventSource.close();
            }
        });
    });

    onDestroy(() => {
        if (eventSource) {
            eventSource.close(); // Close the connection when the component is destroyed
        }
    });

    // HMR specific cleanup to prevent memory leaks and multiple connections
    if (import.meta.hot) {
        import.meta.hot.dispose(() => {
            if (eventSource) {
                eventSource.close();
            }
        });
    }



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
