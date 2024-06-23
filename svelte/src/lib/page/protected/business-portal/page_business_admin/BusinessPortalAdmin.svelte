<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_business_admin/page/Dashboard/Dashboard.svelte";
    import Report from "$lib/page/protected/business-portal/page_business_admin/page/Report/Report.svelte";
    import Employee from "$lib/page/protected/business-portal/page_business_admin/page/Employee/Employee.svelte";
    import Service from "$lib/page/protected/business-portal/page_business_admin/page/Service/Service.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import {listenSseFrom} from "$lib/api/api_server/api_endpoints/sse/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {onMount} from "svelte";
    import {SseEvent} from "$lib/api/api_server/api_endpoints/sse/api.js";
    import {Spinner} from "flowbite-svelte";

    let loading = true;

    let tabs = ["Dashboard", "Report", "Employee", "Service", "Setting"];
    let selectedIndex = 0;

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
    });
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
