<script>
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";
    import {Spinner} from "flowbite-svelte";
    import Login from "$lib/page/protected/page_login/Login.svelte";
    import AdminPortal from "$lib/page/protected/business-portal/page_admin/AdminPortal.svelte";
    import BusinessPortalAdmin
        from "$lib/page/protected/business-portal/page_business_admin/BusinessPortalAdmin.svelte";
    import {business} from "$lib/page/stores/business/business.js";
    import BusinessPortalLobby from "$lib/page/protected/business-portal/page_lobby/BusinessPortalLobby.svelte";
    import BusinessPortalEmployee
        from "$lib/page/protected/business-portal/page_employee/BusinessPortalEmployee.svelte";
    import {employeeSelectOptions} from "$lib/page/stores/employeeSelectOptions/employeeSelectOptions.js";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/functions.js";
    import ModalEditCustomerBooking from "$lib/components/Modal/EditCustomerBooking/ModalEditCustomerBooking.svelte";
    import ModalCreateCustomerBooking
        from "$lib/components/Modal/CreateCustomerBooking/ModalCreateCustomerBooking.svelte";
    import {onMount} from "svelte";
    import {
        eventConfirmation,
        listenSocketFrom,
        handleUnknownEvent,
        ServerEvent, handleTestEvent
    } from "$lib/api/api_server/api_endpoints/sse/api.js";

    export let data;
    let loading = true;

    // User profile
    userProfile.set(data.userProfile);

    // Business
    business.set(data.business);

    // Convert the employee list to selectable options
    if ($business && $business.employeeList && Array.isArray($business.employeeList)) {
        employeeSelectOptions.set($business.employeeList.map(employeeToSelectOption));
    }

    loading = false;

    let socket = undefined;
    let reconnectionTimeout;
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
                if (socket) {
                    socket.close();
                    socket = undefined;
                }

                console.log("Disconnected from WebSocket. Trying to reconnect.");

                clearTimeout(reconnectionTimeout);
                reconnectionTimeout = setTimeout(connectWebSocket, 1000);
            };

            socket.onerror = function (error) {
                if (socket) {
                    socket.close();
                    socket = undefined;
                }

                console.error("Socket disconnected. Trying to reconnect.", error);

                clearTimeout(reconnectionTimeout);
                reconnectionTimeout = setTimeout(connectWebSocket, 1000);
            };

            // Log all received messages
            socket.onmessage = function (event) {
                //console.log('Socket received:', event);

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
            clearTimeout(reconnectionTimeout); // Clear any existing timeout
            reconnectionTimeout = setTimeout(connectWebSocket, 1000); // Attempt reconnection
        }
    }

    const eventHandlers = {
        [ServerEvent.TEST]: handleTestEvent
    };

    onMount(async () => {
        await connectWebSocket();

        return () => {
            socket.close();
        };
    });

    //$: console.log("userProfile", $userProfile);
    //$: console.log("business", $business);
</script>

<div class="min-h-screen w-full">
    {#if loading}
        <div class="flex justify-center items-center h-screen">
            <Spinner/>
        </div>
    {:else if !$userProfile.auth || !$userProfile.user}
        <Login/>
    {:else if $userProfile.user.role === "ADMIN"}
        <AdminPortal/>
    {:else if $userProfile.user.role === "BUSINESS_ADMIN"}
        <BusinessPortalAdmin/>
    {:else if $userProfile.user.role === "LOBBY"}
        <BusinessPortalLobby/>
    {:else if $userProfile.user.role === "EMPLOYEE"}
        <BusinessPortalEmployee/>
    {:else if $userProfile.user.role === "REGISTER"}
        <p>Account is not associated to a business.</p>
    {:else}
        <p>Unexpected user state, please contact support.</p>
    {/if}
</div>

<!-- Create a new customer booking -->
<ModalCreateCustomerBooking
        business={$business}
/>

<!-- Modal for edit customer booking -->
<ModalEditCustomerBooking
        business={$business}
/>
