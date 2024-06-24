<script>
    import Header from "$lib/page/protected/components/Header/Header.svelte";
    import Dashboard from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/Dashboard.svelte";
    import Timetable from "$lib/page/protected/business-portal/page_lobby/page/Timetable/Timetable.svelte";
    import BookingList from "$lib/page/protected/business-portal/page_lobby/page/BookingList/BookingList.svelte";
    import Setting from "$lib/components/Setting/Setting.svelte";
    import SendReview from "$lib/page/protected/business-portal/page_lobby/page/SendReview/SendReview.svelte";
    import {listenSseFrom, SseEvent} from "$lib/api/api_server/api_endpoints/sse/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {onMount} from "svelte";
    import {Spinner} from "flowbite-svelte";
    import {getCustomerBookingQueueList} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {isToday, now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate} from "$lib/application/Formatter.js";
    import {
        customerBookingQueueList,
        findCustomerBookingById
    } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {
        customerBookingClickModal
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";

    let loading = true;

    let tabs = ["Dashboard", "Timetable", "List", "Send review", "Setting"];
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

            eventSource.addEventListener(SseEvent.EMPLOYEE_WORK_SCHEDULE_UPDATE, async (event) => {
                console.log('EMPLOYEE_WORK_SCHEDULE_UPDATE event received:', event);
            });

            eventSource.addEventListener(SseEvent.CUSTOMER_BOOKING_UPDATE, async (event) => {
                console.log('CUSTOMER_BOOKING_UPDATE event received:', event);

                // Get the updated customer booking
                const updatedCustomerBooking = JSON.parse(event.data);

                // Re-fetch
                if (isToday(updatedCustomerBooking.bookingDate))
                {
                    await fetchCustomerBookingQueueList();
                }
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

    onMount(async () => {
        connectSSE()
            .then(() => console.log("Connected SSE."));

        await fetchCustomerBookingQueueList();

        loading = false;

        return async () => {
            if (eventSource) {
                eventSource.close();
                eventSource = undefined;
            }
            clearTimeout(reconnectionTimeout); // Clear timeout on component destroy
        };
    });

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
