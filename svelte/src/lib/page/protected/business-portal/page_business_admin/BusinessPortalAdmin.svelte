<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Dashboard.svelte";
    import Report from "$lib/page/protected/business-portal/page_business_admin/page/Report/Report.svelte";
    import Employee from "$lib/page/protected/business-portal/page_business_admin/page/Employee/Employee.svelte";
    import Service from "$lib/page/protected/business-portal/page_business_admin/page/Service/Service.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import {Spinner} from "flowbite-svelte";
    import {
        eventConfirmation, handleBusinessUpdate, handleTestEvent,
        handleUnknownEvent,
        listenSocketFrom,
        ServerEvent
    } from "$lib/api/api_server/api_endpoints/sse/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {onMount} from "svelte";

    let loading = true;

    let tabs = ["Dashboard", "Report", "Employee", "Service", "Setting"];
    let selectedIndex = 0;

    let socket = undefined;
    async function connectWebSocket() {
        try {
            if (socket) {
                socket.close();
                socket = undefined;
            }

            socket = new WebSocket(listenSocketFrom($business.businessInfo.businessID));

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
                console.log('Socket received:', event);

                const eventData = JSON.parse(event.data);

                //console.log("eventData", eventData);

                // EVENT_REQUEST
                // eventData = { type, event, requestId }
                if (eventData.type === ServerEvent.EVENT_REQUEST)
                {
                    // Can handle the event
                    // Send back a confirmation to get the event
                    if (eventHandlers[eventData.event])
                    {
                        eventConfirmation(socket, eventData.requestId, true);
                    }
                    else
                    {
                        eventConfirmation(socket, eventData.requestId, false);
                    }
                }
                // Handle event
                else
                {
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
        [ServerEvent.BUSINESS_UPDATE]: handleBusinessUpdate
    };

    let reconnectionTimeout;
    function reconnectWebSocket() {
        clearTimeout(reconnectionTimeout);
        reconnectionTimeout = setTimeout(connectWebSocket, 1000); // Add a 1-second delay before reconnecting
    }

    onMount(async () => {
        await connectWebSocket();

        loading = false;

        return () => {
            socket.close();
        };
    });



   /* let eventSource = undefined;
    let reconnectionTimeout;

    async function connectSSE() {
        try {
            if (eventSource)
            {
                eventSource.close();
                eventSource = undefined;
            }

            console.log("Connecting SSE...");
            eventSource = new EventSource(listenSseFrom($business.businessInfo.businessID));

            // Log all received messages
            eventSource.onmessage = function(event) {
                console.log('Message received:', event.data);
            };

            eventSource.addEventListener(SseEvent.TEST, (event) => {
                console.log("Test event triggered:", event.data);
            });

            eventSource.addEventListener(SseEvent.BUSINESS_UPDATE, (event) => {
                console.log('BUSINESS_UPDATE event received:', event);
                business.set(JSON.parse(event.data));
            });

            eventSource.onerror = function (error) {
                eventSource.close();
                eventSource = undefined;
                console.error("SSE disconnected. Trying to reconnect.", error);

                clearTimeout(reconnectionTimeout);
                reconnectionTimeout = setTimeout(connectSSE, 1000);
            };
        } catch (error) {
            console.error("Error initializing SSE:", error);
            clearTimeout(reconnectionTimeout); // Clear any existing timeout
            reconnectionTimeout = setTimeout(connectSSE, 1000); // Attempt reconnection
        }
    }

    onMount(() => {
        connectSSE();

        loading = false;

        return async () => {
            if (eventSource) {
                eventSource.close();
                eventSource = undefined;
            }
            clearTimeout(reconnectionTimeout); // Clear timeout on component destroy
        };
    });*/
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner/>
    </div>
{:else}
    <Header
            {tabs}
            bind:selectedIndex={selectedIndex}
    />

    <div class="m-1">
        {#if selectedIndex === 0}
            <Dashboard/>
        {:else if selectedIndex === 1}
            <Report/>
        {:else if selectedIndex === 2}
            <Employee/>
        {:else if selectedIndex === 3}
            <Service/>
        {:else if selectedIndex === 4}
            <Setting/>
        {/if}
    </div>
{/if}
