<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import MyTimetable from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/MyTimetable.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import UpcomingService
        from "$lib/page/protected/business-portal/page_employee/page/UpcomingService/UpcomingService.svelte";
    import {
        servicingTicketClickModal
    } from "$lib/components/TimeTable/ServicingTicketClickModal/stores/servicingTicketClickModal.js";

    let tabs = ["Upcoming Service", "My Timetable", "Setting"];
    let selectedIndex = 0;

    $: if (selectedIndex !== 0) {
        servicingTicketClickModal.update(current => {
            return {...current, open: false};
        });
    }

    /*let eventSource = undefined;
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

                /!*getBusiness($business.businessInfo.businessID)
                    .then(updatedBusiness => {
                        business.set(updatedBusiness);
                    })
                    .catch(error => {
                        console.error("Error fetching business data:", error);
                    });*!/
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

        return async () => {
            if (eventSource) {
                eventSource.close();
                eventSource = undefined;
            }
            clearTimeout(reconnectionTimeout); // Clear timeout on component destroy
        };
    });*/
</script>

<div class="flex flex-col h-screen overflow-hidden z-[1006]">
    <Header
            bind:selectedIndex={selectedIndex}
            {tabs}
    />

    {#if selectedIndex === 0}
        <UpcomingService/>
    {:else if selectedIndex === 1}
        <MyTimetable/>
    {:else if selectedIndex === 2}
        <Setting/>
    {/if}
</div>
