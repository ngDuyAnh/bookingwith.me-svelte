<script>
    import Dashboard from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Dashboard.svelte";
    import Metrics from "$lib/page/protected/business-portal/page_business_admin/page/Metrics/Metrics.svelte";
    import Employee from "$lib/page/protected/business-portal/page_business_admin/page/Employee/Employee.svelte";
    import Service from "$lib/page/protected/business-portal/page_business_admin/page/Service/Service.svelte";
    import NavBar from "$lib/page/protected/components/NavBar/NavBar.svelte";
    import {Spinner} from "flowbite-svelte";
    import {
        eventConfirmation,
        handleBusinessUpdate,
        handleTestEvent,
        handleHeartbeatEvent,
        handleUnknownEvent,
        listenSocketFrom,
        ServerEvent,
    } from "$lib/api/api_server/api_endpoints/ws/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {onMount} from "svelte";
    import {isToday} from "$lib/page/stores/business/business.js";
    import {
        fetchCustomerBookingQueueList
    } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import TimetableComponent from "$lib/components/Timetable/TimetableComponent.svelte";
    import Setting from "$lib/page/protected/business-portal/page_business_admin/page/Setting/Setting.svelte";
    import Tips from "$lib/page/protected/business-portal/page_business_admin/page/Tips/Tips.svelte";

    let tabs = ["Dashboard", "Metrics", "Timetable", "Employee", "Service", "Setting", "Tips"];

    let dropdownOptions = {
        Metrics: {
            Service: ["Usage Information", "Billing"],
        },
    };
    let selectedDropDownIndex = 0;
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
                console.log("Disconnected from WebSocket. Trying to reconnect.");
                if (socket) {
                    socket.close();
                    socket = undefined;
                }

                reconnectWebSocket();
            };

            socket.onerror = function (error) {
                console.error("Socket error. Trying to reconnect.", error);
                if (socket) {
                    socket.close();
                    socket = undefined;
                }

                reconnectWebSocket();
            };

            // Log all received messages
            socket.onmessage = function (event) {
                // console.log("Socket received:", event);

                const eventData = JSON.parse(event.data);

                //console.log("eventData", eventData);

                // EVENT_REQUEST
                // eventData = { type, event, requestId }
                if (eventData.type === ServerEvent.EVENT_REQUEST) {
                    // Can handle the event
                    // Send back a confirmation to get the event
                    if (eventHandlers[eventData.event]) {
                        eventConfirmation(socket, eventData.requestId, true);
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
        [ServerEvent.UPDATE_CUSTOMER_BOOKING]: handleCustomerBookingUpdate
    };

    let reconnectionTimeout;

    function reconnectWebSocket() {
        clearTimeout(reconnectionTimeout);
        reconnectionTimeout = setTimeout(connectWebSocket, 10000);
    }

    onMount(async () => {
        await connectWebSocket();

        loading = false;

        return () => {
            socket.close();
        };
    });

    async function handleCustomerBookingUpdate(eventData) {
        const customerBooking = eventData.data;

        // console.log(`Handle ${eventData.type}`, eventData);

        // Dashboard
        if (isToday(customerBooking.bookingDate)) {
            await fetchCustomerBookingQueueList();
        }

    }
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner/>
    </div>
{:else}
    <NavBar
            bind:selectedIndex
            bind:tabs
            dropdown={true}
            {dropdownOptions}
            bind:selectedDropDownIndex
    />

    <div class="m-1">
        {#if selectedIndex === 0}
            <Dashboard
                    bind:selectedDropDownIndex
                    bind:selectedIndex
                    {tabs}
                    {dropdownOptions}
            />
        {:else if selectedIndex === 1}
            <Metrics bind:selectedDropDownIndex/>
        {:else if selectedIndex === 2}
            <TimetableComponent
                    editable={false}
                    limitShowEvents={false}
                    restrictedPast={false}
                    showPastEmployeeWorkScheduleModal={true}
                    ableToChangeEmployeeWorkSchedule={true}
            />
        {:else if selectedIndex === 3}
            <Employee/>
        {:else if selectedIndex === 4}
            <Service/>
        {:else if selectedIndex === 5}
            <Setting/>
        {:else if selectedIndex === 6}
            <Tips/>
        {/if}
    </div>
{/if}
