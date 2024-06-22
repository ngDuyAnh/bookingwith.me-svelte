<script>
    import {onMount, setContext} from "svelte";
    import {getCustomerBookingQueueList} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {initializeCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {formatToDate} from "$lib/application/Formatter.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import Appointment
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Appointment/Appointment.svelte";
    import Lobby from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Lobby/Lobby.svelte";
    import Servicing
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/Servicing.svelte";
    import Completed
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Completed/Completed.svelte";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        bookingStateList,
        findCustomerBookingById
    } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {
        customerBookingClickModal
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {Spinner} from "flowbite-svelte";
    import CustomerBookingClickModal
        from "$lib/components/CustomerBookingClickModal/CustomerBookingClickModal.svelte";

    async function fetchCustomerBookingList()
    {
        loading = true;

        // Get the customer booking list
        const response = await getCustomerBookingQueueList($business.businessInfo.businessID, $now.format(formatToDate));
        bookingStateList.set(response.customerBookingQueueList);

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
        loading = false;

        console.log("bookingStateList", $bookingStateList)
    }

    setContext('fetchCustomerBookingList', fetchCustomerBookingList);

    let loading = true;
    onMount(async () => {
        await fetchCustomerBookingList();

        loading = false;

    });

    // Automatic fetch for the latest customer booking list
    //setInterval(async () => fetchCustomerBookingList(), 10000);

    async function submitCustomerBooking(customerBooking)
    {
        // Submit the change to the server
        await initializeCustomerBooking(customerBooking);

        // Update the customer booking list
        await fetchCustomerBookingList();
    }

    setContext('submitCustomerBooking', submitCustomerBooking);
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner />
    </div>
{:else}
    <div class="flex flex-row w-screen h-screen justify-between 2xl:items-center 2xl:justify-center space-x-4 overflow-x-auto p-4">
        <Appointment/>
        <Lobby/>
        <Servicing/>
        <Completed/>
    </div>
{/if}

<!-- Modal for customer booking click -->
<CustomerBookingClickModal/>
