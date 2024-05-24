<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import {
        moveToLobby
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {initializeCustomerBooking} from "$lib/api/api_server/lobby-portal/api.js";
    import {Button, Modal} from "flowbite-svelte";
    import {ExclamationCircleOutline} from "flowbite-svelte-icons";

    let openArrivalModal = false;
    async function notifyArrival()
    {
        await moveToLobby($now, $bookingEstimate.customerBooking, initializeCustomerBooking);

        // Send an alert to let the customer know that they have been moved to lobby
        alert("Thank you for letting us know you have arrived. Please wait in the lobby until you are called.");
    }
</script>

<div>
    <p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
        Your appointment is
        <span class="underline">today</span>!
    </p>
    <div class="mt-4 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        Your position in the queue is {$bookingEstimate.queuePosition}
    </div>
    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        Estimate start servicing time is from {$bookingEstimate.estimateServicingStartTime} to {$bookingEstimate.estimateServicingEndTime}
    </div>
    <div class="mt-2 bg-red-100 text-green-800 rounded-lg p-4 shadow">
        Please arrive early to ensure smooth service. Our app is still in testing, so we apologize for any timing errors. Your feedback is welcome via the top right corner.
    </div>

    <div class="mt-4">
        <button on:click={() => {openArrivalModal = true}} class="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-700">
            I have arrived in the lobby
        </button>
    </div>
</div>

<Modal bind:open={openArrivalModal} size="xs" autoclose outsideclose>
    <div class="text-center">
        <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">You have arrived in the lobby?</h3>
        <Button color="red" class="me-2" on:click={notifyArrival}>Yes, I am here!</Button>
        <Button color="alternative">Cancel</Button>
    </div>
</Modal>
