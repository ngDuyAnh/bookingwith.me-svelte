<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/Dashboard.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_lobby/page/Timetable/Timetable.svelte";
    import BookingList from "$lib/page/protected/business-portal/page_lobby/page/BookingList/BookingList.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import SendReview from "$lib/page/protected/business-portal/page_lobby/page/SendReview/SendReview.svelte";
    import {business} from "$lib/page/stores/business/business.js";
     import {Spinner} from "flowbite-svelte";
    import {getCustomerBookingQueueList} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate} from "$lib/application/Formatter.js";
    import {
        customerBookingQueueList,
        findCustomerBookingById
    } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {
        customerBookingClickModal
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {
        eventConfirmation, handleTestEvent,
        handleUnknownEvent,
        listenSocketFrom,
        ServerEvent
    } from "$lib/api/api_server/api_endpoints/sse/api.js";
    import {onMount} from "svelte";
    import {isToday} from "$lib/page/stores/now/now_dayjs_store.js";
    import {handleBusinessUpdate} from "$lib/api/api_server/api_endpoints/sse/api.js";

    let loading = true;

    let tabs = ["Dashboard", "Timetable", "List", "Send review", "Setting"];
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
        [ServerEvent.BUSINESS_UPDATE]: handleBusinessUpdate,
        [ServerEvent.CUSTOMER_BOOKING_UPDATE]: handleCustomerBookingUpdate,
        [ServerEvent.EMPLOYEE_WORK_SCHEDULE_UPDATE]: handleCustomerBookingUpdate,
    };

    let reconnectionTimeout;
    function reconnectWebSocket() {
        clearTimeout(reconnectionTimeout);
        reconnectionTimeout = setTimeout(connectWebSocket, 1000); // Add a 1-second delay before reconnecting
    }

    onMount(async () => {
        await connectWebSocket();

        await fetchCustomerBookingQueueList();

        loading = false;

        return () => {
            socket.close();
        };
    });

    async function handleCustomerBookingUpdate(event)
    {
        console.log(`Handle ${ServerEvent.CUSTOMER_BOOKING_UPDATE}`, event)
        if (isToday(event.data.bookingDate))
        {
            await fetchCustomerBookingQueueList();
        }
    }

    async function fetchCustomerBookingQueueList()
    {
        // Get the customer booking list
        const response = await getCustomerBookingQueueList($business.businessInfo.businessID, $now.format(formatToDate));
        customerBookingQueueList.set(response.customerBookingQueueList);

        // Find and reinitialize the customer booking for the modal
        if ($customerBookingClickModal.customerBooking)
        {
            const findID = $customerBookingClickModal.customerBooking.id;
            const foundCustomerBooking = findCustomerBookingById(findID);
            if (foundCustomerBooking) {
                customerBookingClickModal.update(current => {
                    return {
                        ...current,
                        customerBooking: foundCustomerBooking
                    };
                });
            } else {
                console.log('Customer booking not found for customer booking click modal.');
            }
        }

        //console.log("bookingStateList", $bookingStateList)
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
