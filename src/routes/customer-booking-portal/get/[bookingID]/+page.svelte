<script>
    import dayjs from 'dayjs';
    import {onMount} from "svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {
        initializeCustomerBooking
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {Spinner} from "flowbite-svelte";
    import Today from "$lib/page/customer-booking-portal/get/page/Today/Today.svelte";
    import Future from "$lib/page/customer-booking-portal/get/page/Future/Future.svelte";
    import {handleCustomerBookingEstimateUpdateEvent} from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
    import Deleted from "$lib/page/customer-booking-portal/get/page/Deleted/Deleted.svelte";
    import {business} from "$lib/page/stores/business/business.js";
    import ModalEditCustomerBooking from "$lib/components/Modal/EditCustomerBooking/ModalEditCustomerBooking.svelte";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import Past from "$lib/page/customer-booking-portal/get/page/Past/Past.svelte";
    import NoShow from "$lib/page/customer-booking-portal/get/page/NoShow/NoShow.svelte";
    import {getCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {customerBooking} from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
    import {getBusinessFromCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {
        eventConfirmation,
        handleTestEvent,
        handleHeartbeatEvent,
        handleUnknownEvent,
        listenSocketFrom,
        ServerEvent
    } from "$lib/api/api_server/api_endpoints/ws/api.js";
    import {
        fetchCustomerBookingEstimate
    } from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
    import Completed from "$lib/page/customer-booking-portal/get/page/Today/components/Completed/Completed.svelte";

    export let data;
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
                        if ($customerBooking &&
                            $customerBooking.bookingDate !== eventData.date)
                        {
                            confirm = false;
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
        [ServerEvent.UPDATE_CUSTOMER_BOOKING_ESTIMATE]: handleCustomerBookingEstimateUpdateEvent,
        [ServerEvent.UPDATE_CUSTOMER_BOOKING]: handleCustomerBookingUpdate
    };

    let reconnectionTimeout;
    function reconnectWebSocket() {
        clearTimeout(reconnectionTimeout);
        reconnectionTimeout = setTimeout(connectWebSocket, 60000);
    }

    async function handleCustomerBookingUpdate(eventData) {
        const updatedCustomerBooking = eventData.data;

        // console.log(`Handle ${eventData.type}`, eventData)

        // Is customer booking
        if ($customerBooking.bookingID === updatedCustomerBooking.bookingID)
        {
            customerBooking.set(updatedCustomerBooking);
        }
    }

    let relativeDate = 0;
    $: if ($customerBooking)
    {
        relativeDate = dayjs($customerBooking.bookingDate).startOf("day")
            .diff($now.startOf("day"), "day");
    }

    onMount(async () =>{
        // Get the customer booking and business
        const customerBookingPromise = getCustomerBooking(data.bookingID);
        const businessPromise = getBusinessFromCustomerBooking(data.bookingID);

        // Wait for both promises to resolve
        const [customerBookingResponse, businessResponse] = await Promise.all([customerBookingPromise, businessPromise]);

        // Set
        customerBooking.set(customerBookingResponse);
        business.set(businessResponse);

        // Record the SMS confirmation
        if (!$customerBooking.smsConfirmation)
        {
            $customerBooking.smsConfirmation = true;

            initializeCustomerBooking($customerBooking)
                .then(updatedCustomerBooking => {
                    // Update the booking estimate store with the new data
                    customerBooking.set(updatedCustomerBooking);
                    console.log('SMS confirmation initialized and saved to database.');
                })
                .catch(error => {
                    console.error('Error initializing SMS confirmation:', error);
                });
        }

        // Connect WebSocket
        connectWebSocket()
            .then(() => {
                // console.log("Initial websocket connected.")
            });

        // Get the customer booking servicing estimate
        await fetchCustomerBookingEstimate();

        loading = false;
    })

    //$: console.log("customerBookingEstimate", customerBookingEstimate);
</script>

<div class="h-dvh w-screen">
    {#if loading}
        <div class="flex justify-center items-center h-full w-full">
            <Spinner />
        </div>
    {:else}
        <div class="flex flex-col text-gray-900 h-full w-full">
            <!--When customer booking is deleted, still allow review-->
            {#if $customerBooking.deleted}
                <Completed/>
            {:else if $customerBooking.noShow}
                <NoShow/>
            {:else if relativeDate > 0}
                <Future/>
            {:else if relativeDate === 0 ||
                    $customerBooking.bookingState === CustomerBookingState.COMPLETED}
                <Today/>
            {:else}
                <Past/>
            {/if}
        </div>

        <!-- Modal for edit customer booking -->
        <ModalEditCustomerBooking
                business={$business}
        />
    {/if}
</div>
