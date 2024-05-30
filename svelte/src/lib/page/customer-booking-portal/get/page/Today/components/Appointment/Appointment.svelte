<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import {
        moveToLobby
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {initializeCustomerBooking} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {Button, Modal} from "flowbite-svelte";
    import {ExclamationCircleOutline} from "flowbite-svelte-icons";

    /* import {getContext} from "svelte";

    const fetchCustomerBookingEstimate = getContext('fetchCustomerBookingEstimate');
    */
    let openArrivalModal = false;
    async function notifyArrival()
    {
        await moveToLobby($now, $bookingEstimate.customerBooking, initializeCustomerBooking);

        console.log("moveToLobby", $bookingEstimate.customerBooking)

        // Force react
        bookingEstimate.set($bookingEstimate);

        //await fetchCustomerBookingEstimate();

        // Send an alert to let the customer know that they have been moved to lobby
        alert("Thank you for letting us know you have arrived. Please wait in the lobby until you are called.");
    }
</script>

<div class="p-6 rounded-lg space-y-4">
    <p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
        Your appointment is
        <span class="underline">today</span>!
    </p>
    <div class="bg-green-100 text-green-800 rounded-lg p-4 shadow-md flex items-center">
        <span>Your position in the queue is: </span>
        <span class="text-lgn font-semibold">{$bookingEstimate.queuePosition}</span>
    </div>
    <div class="bg-green-100 text-green-800 rounded-lg p-4 shadow-lg items-center">
        <span class="">Estimate start servicing time is from </span>
        <span class="text-lgn font-semibold">{$bookingEstimate.estimateServicingStartTime}</span>
        <span class="">to</span>
        <span class="text-lgn font-semibold">{$bookingEstimate.estimateServicingEndTime}</span>
    </div>
    <div class="bg-red-100 text-red-800 rounded-lg p-4 shadow-md flex items-center">
        <span>
            Please arrive early to ensure smooth service. Our app is still in testing, so we apologize for any timing errors.
        </span>
    </div>

    <div class="flex justify-center">
        <button on:click={() => {openArrivalModal = true}}
                class="animate-pulse bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
            I have arrived in the lobby
        </button>
    </div>
</div>

<!-- Modal to confirm the customer arrival in the lobby -->
<Modal bind:open={openArrivalModal} size="xs" autoclose outsideclose>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">You have arrived in the lobby?</h3>
        <Button color="red" class="me-2" on:click={notifyArrival}>Yes, I am here!</Button>
        <Button color="alternative">Cancel</Button>
    </div>
</Modal>
