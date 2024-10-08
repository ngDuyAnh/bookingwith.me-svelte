<script>
    import MyTimetable from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/MyTimetable.svelte";
    import UpcomingService
        from "$lib/page/protected/business-portal/page_employee/page/UpcomingService/UpcomingService.svelte";
    import NavBar from "$lib/page/protected/components/NavBar/NavBar.svelte";
    import {
        eventConfirmation, handleBusinessUpdate, handleHeartbeatEvent, handleTestEvent,
        handleUnknownEvent,
        listenSocketFrom,
        ServerEvent
    } from "$lib/api/api_server/api_endpoints/ws/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {isToday} from "$lib/page/stores/business/business.js";
    import {fetchTimetable, timetableComponent} from "$lib/components/Timetable/stores/timetableComponent.js";
    import {
        bookingList
    } from "$lib/page/protected/business-portal/page_lobby/page/BookingList/stores/bookingList.js";
    import {onMount} from "svelte";
    import {Spinner} from "flowbite-svelte";
    import {
        fetchCustomerBookingQueueList
    } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import Information from "$lib/page/protected/business-portal/page_employee/page/Information/Information.svelte";

    let tabs = ["My Timetable", "Service Spotlight", "Information"];
    let selectedIndex = 0;

    let loading = true;

    let socket = undefined;

    async function connectWebSocket() {
        try {
            if (socket) {
                socket.close();
                socket = undefined;
            }

            socket = new WebSocket(
                listenSocketFrom($business.businessInfo.businessID)
            );

            socket.onopen = function () {
                console.log("Socket connected.");
            };

            socket.onclose = function () {
                //console.log("Disconnected from WebSocket. Trying to reconnect.");
                if (socket) {
                    socket.close();
                    socket = undefined;
                }

                reconnectWebSocket();
            };

            socket.onerror = function () {
                /*
                        socket.onerror = function (error) {
                        console.error("Socket error. Trying to reconnect.", error);
                        */

                if (socket) {
                    socket.close();
                    socket = undefined;
                }

                reconnectWebSocket();
            };

            // Log all received messages
            socket.onmessage = function (event) {
                //console.log('Socket received:', event);

                const eventData = JSON.parse(event.data);

                // console.log("eventData", eventData);

                // EVENT_REQUEST
                // eventData = { type, event, requestId }
                if (eventData.type === ServerEvent.EVENT_REQUEST) {
                    // Can handle the event
                    // Send back a confirmation to get the event
                    if (eventHandlers[eventData.event]) {
                        let confirm = true;
                        if (eventData.date) {
                            confirm =
                                isToday(eventData.date) ||
                                $timetableComponent.date === eventData.date ||
                                $bookingList.date === eventData.date;
                        }

                        eventConfirmation(socket, eventData.requestId, confirm);
                    } else {
                        eventConfirmation(socket, eventData.requestId, false);
                    }
                }
                // Handle event
                else {
                    const handler = eventHandlers[eventData.type] || handleUnknownEvent;
                    handler(eventData);
                }
            };
        } catch (error) {
            console.error("Error initializing SSE:", error);
            reconnectWebSocket();
        }
    }

    const eventHandlers = {
        [ServerEvent.TEST]: handleTestEvent,
        [ServerEvent.HEARTBEAT]: handleHeartbeatEvent,
        [ServerEvent.UPDATE_BUSINESS]: handleBusinessUpdate,
        [ServerEvent.UPDATE_EMPLOYEE_WORK_SCHEDULE]: handleEmployeeWorKScheduleUpdate,
        [ServerEvent.UPDATE_CUSTOMER_BOOKING]: handleCustomerBookingUpdate
    };

    let reconnectionTimeout;

    function reconnectWebSocket() {
        clearTimeout(reconnectionTimeout);
        reconnectionTimeout = setTimeout(connectWebSocket, 500);
    }

    onMount(() => {
        connectWebSocket();

        fetchCustomerBookingQueueList();
        fetchTimetable($timetableComponent.date);

        loading = false;

        return () => {
            socket.close();
        };
    });

    async function handleEmployeeWorKScheduleUpdate() {
        // console.log(`Handle ${eventData.type}`, eventData);
        await fetchTimetable($timetableComponent.date);
    }

    // The timetable uses t
    async function handleCustomerBookingUpdate(eventData) {
        const customerBooking = eventData.data;

        // We need to get the customer booking queue
        // The timetable uses it to get customer booking instance
        if (isToday(customerBooking.bookingDate)) {
            await fetchCustomerBookingQueueList();
        }

        // Timetable
        if ($timetableComponent.date === customerBooking.bookingDate) {

            console.log("Updating timetable")

            await fetchTimetable($timetableComponent.date);
        }
    }
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner/>
    </div>
{:else}
    <div class="flex flex-col h-screen overflow-hidden z-[1006]">
        <NavBar bind:selectedIndex bind:tabs/>

        {#if selectedIndex === 0}
            <MyTimetable/>
        {:else if selectedIndex === 1}
            <UpcomingService/>
        {:else if selectedIndex === 2}
            <Information/>
        {/if}
    </div>
{/if}
