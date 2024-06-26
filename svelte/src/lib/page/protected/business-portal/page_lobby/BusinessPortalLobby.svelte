<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/Dashboard.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_lobby/page/Timetable/Timetable.svelte";
    import BookingList from "$lib/page/protected/business-portal/page_lobby/page/BookingList/BookingList.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import SendReview from "$lib/page/protected/business-portal/page_lobby/page/SendReview/SendReview.svelte";
    import {business} from "$lib/page/stores/business/business.js";
    import {Spinner} from "flowbite-svelte";
    import {
        fetchCustomerBookingQueueList
    } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {
        eventConfirmation, handleTestEvent,
        handleUnknownEvent,
        listenSocketFrom,
        ServerEvent
    } from "$lib/api/api_server/api_endpoints/ws/api.js";
    import {onMount} from "svelte";
    import {isToday} from "$lib/page/stores/now/now_dayjs_store.js";
    import {handleBusinessUpdate} from "$lib/api/api_server/api_endpoints/ws/api.js";
    import {
        fetchTimetable,
        timetableComponent
    } from "$lib/components/TimeTable/stores/timetableComponent.js";
    import {
        bookingList,
        fetchAppointmentCustomerBookingList
    } from "$lib/page/protected/business-portal/page_lobby/page/BookingList/stores/bookingList.js";

    let tabs = ["Dashboard", "Timetable", "List", "Send review", "Setting"];
    let selectedIndex = 0;

    let loading = true;

    let socket = undefined;

    async function connectWebSocket() {
        try {
            if (socket) {
                socket.close();
                socket = undefined;
            }

            socket = new WebSocket(listenSocketFrom($business.businessInfo.businessID));

            socket.onopen = function () {
                //console.log("Socket connected.");
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

                //console.log("eventData", eventData);

                // EVENT_REQUEST
                // eventData = { type, event, requestId }
                if (eventData.type === ServerEvent.EVENT_REQUEST) {
                    // Can handle the event
                    // Send back a confirmation to get the event
                    if (eventHandlers[eventData.event]) {
                        let confirm = true;
                        if (eventData.date)
                        {
                            confirm = isToday(eventData.date) ||
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
        [ServerEvent.UPDATE_BUSINESS]: handleBusinessUpdate,
        [ServerEvent.UPDATE_EMPLOYEE_WORK_SCHEDULE]: handleEmployeeWorKScheduleUpdate,
        [ServerEvent.UPDATE_CUSTOMER_BOOKING]: handleCustomerBookingUpdate,
    };

    let reconnectionTimeout;

    function reconnectWebSocket() {
        clearTimeout(reconnectionTimeout);
        reconnectionTimeout = setTimeout(connectWebSocket, 200);
    }

    onMount(async () => {
        await connectWebSocket();

        await fetchCustomerBookingQueueList();

        loading = false;

        return () => {
            socket.close();
        };
    });

    async function handleEmployeeWorKScheduleUpdate(eventData) {
        console.log(`Handle ${eventData.type}`, eventData)
        await fetchTimetable($timetableComponent.date);
    }

    async function handleCustomerBookingUpdate(eventData) {
        const customerBooking = eventData.data;

        console.log(`Handle ${eventData.type}`, eventData)

        // Dashboard
        if (isToday(customerBooking.bookingDate)) {
            await fetchCustomerBookingQueueList();
        }

        // Timetable
        if ($timetableComponent.date === customerBooking.bookingDate) {
            await fetchTimetable($timetableComponent.date);
        }

        // Booking list
        if ($bookingList.date === customerBooking.bookingDate) {
            fetchAppointmentCustomerBookingList($business.businessInfo.businessID, $bookingList.date);
        }
    }
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner/>
    </div>
{:else}
    <div class="flex flex-col h-screen overflow-hidden z-[1006]">
        <Header {tabs} bind:selectedIndex/>

        {#if selectedIndex === 0}
            <Dashboard/>
        {:else if selectedIndex === 1}
            <Timetable/>
        {:else if selectedIndex === 2}
            <BookingList/>
        {:else if selectedIndex === 3}
            <SendReview/>
        {:else if selectedIndex === 4}
            <Setting/>
        {/if}
    </div>
{/if}
