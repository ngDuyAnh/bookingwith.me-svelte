<script>
    import {onMount, setContext} from "svelte";
    import {getLobbyBookingList, initializeCustomerBooking} from "$lib/api/api_server/lobby-portal/api.js";
    import {formatToDate} from "$lib/application/Formatter.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {bookingStateList} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {getRecentCustomerBooking} from "$lib/api/api_server/lobby-portal/api.js";
    import Appointment
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Appointment/Appointment.svelte";
    import Lobby from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Lobby/Lobby.svelte";
    import Servicing
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/Servicing.svelte";
    import Completed
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Completed/Completed.svelte";
    import {
        CustomerBooking
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions/CustomerBooking.js";
    import {business} from "$lib/page/protected/stores/business.js";

    let latestCustomerBooking = CustomerBooking($now);
    async function fetchCustomerBookingList()
    {
        // Get the customer booking list
        const response = await getLobbyBookingList($business.businessInfo.businessID, $now.format(formatToDate));

        console.log("fetchCustomerBookingList", response)

        bookingStateList.set(response.bookingList);
    }

    async function updateCustomerBookingList()
    {
        try
        {
            const customerBooking = await getRecentCustomerBooking($business.businessInfo.businessID, $now.format(formatToDate));

            //console.log("updateCustomerBookingList()", customerBooking)

            if (latestCustomerBooking.bookingID !== customerBooking.bookingID ||
                latestCustomerBooking.bookingState !== customerBooking.bookingState) {

                latestCustomerBooking = customerBooking;

                // Get the customer booking list
                await fetchCustomerBookingList();

                console.log("bookingStateList", $bookingStateList);
            }
        }
        catch (error)
        {
            console.error(error);
        }
    }

    onMount(async () => {
        await updateCustomerBookingList();
    });

    // Automatic fetch for the latest customer booking list
    setInterval(async () => updateCustomerBookingList(), 10000);

    async function submitCustomerBooking(customerBooking)
    {
        // Submit the change to the server
        await initializeCustomerBooking(customerBooking);

        // Update the customer booking list
        await fetchCustomerBookingList();
    }

    setContext('submitCustomerBooking', submitCustomerBooking);
</script>

<div class="flex flex-row justify-between space-x-4 overflow-x-auto p-4 flex-1">
    <Appointment/>
    <Lobby/>
    <Servicing/>
    <Completed/>
</div>
