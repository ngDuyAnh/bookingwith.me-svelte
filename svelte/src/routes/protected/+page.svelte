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
    import {listenSseFrom} from "$lib/api/api_server/api_endpoints/sse/api.js";
    import {onMount} from "svelte";

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

    let eventSource = undefined;
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

            eventSource.addEventListener('BUSINESS_UPDATE', (event) => {
                console.log('BUSINESS_UPDATE event received:', event);

                business.set(JSON.parse(event.data));

                /*getBusiness($business.businessInfo.businessID)
                    .then(updatedBusiness => {
                        business.set(updatedBusiness);
                    })
                    .catch(error => {
                        console.error("Error fetching business data:", error);
                    });*/
            });

            eventSource.addEventListener('TEST', (event) => {
                console.log("Test event triggered:", event.data);
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
