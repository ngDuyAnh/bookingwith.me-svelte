<script>
  import { bookingEstimate } from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
  import { moveToLobby } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
  import { now } from "$lib/page/stores/now/now_dayjs_store.js";
  import { initializeCustomerBooking } from "$lib/api/api_server/customer-booking-portal/api.js";
  import { Button, Modal } from "flowbite-svelte";
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";
  import LiveIndicator from "$lib/page/customer-booking-portal/get/page/components/LiveIndicator/LiveIndicator.svelte";

  let openArrivalModal = false;
  let googleMapsLink = "";
  async function notifyArrival() {
    moveToLobby(
      $now,
      $bookingEstimate.customerBooking,
      initializeCustomerBooking
    );

    // Force react
    bookingEstimate.set($bookingEstimate);

    // Send an alert to let the customer know that they have been moved to lobby
    alert(
      "Thank you for letting us know you have arrived. Please wait in the lobby until you are called."
    );
  }

  $: console.log($bookingEstimate);
  $: googleMapsLink = $bookingEstimate.googleMapsLink;
</script>

<div class="w-screen h-screen flex flex-col items-center justify-center  p-6 rounded-lg space-y-4">
  <div class="flex items-center justify-center">
    <div class="w-[max-content]">
      <div
        class="relative text-xl rounded-t-lg font-bold flex bg-white text-blue-900 p-4 border-t-2 border-x-2"
      >
        <span>
          Your appointment is <span class="underline">today</span>!
        </span>
        <LiveIndicator />
      </div>

      <div class="bg-white text-red-800 p-4 flex border-x-2 text-sm">
        <span> Please arrive early to ensure smooth service. </span>
      </div>

      <div
        class="relative flex flex-col bg-white text-green-800 p-4 border-x-2 border-b-2 rounded-b-lg w-full"
      >
        <div class="flex justify-between w-full mt-auto">
          <div class="flex flex-col">
            <span>Queue position </span>
            <span class="animate-pulse text-sm font-semibold"
              >{$bookingEstimate.queuePosition}</span
            >
          </div>
          <div class="flex flex-col items-end">
            <span>Servicing time</span>
            <div>
              <span class="animate-pulse text-sm font-semibold"
                >{$bookingEstimate.estimateServicingStartTime}</span
              >
              <span class="text-sm">to</span>
              <span class="animate-pulse text-sm font-semibold"
                >{$bookingEstimate.estimateServicingEndTime}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-1 flex justify-center">
    <button
      on:click={() => {
        openArrivalModal = true;
      }}
      class="animate-pulse bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
    >
      Check in
    </button>

    <a
      href={googleMapsLink}
      target="_blank"
      type="button"
      class="ml-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    >
      <svg
        class="w-6 h-6 text-gray-800 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fill-rule="evenodd"
          d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
  </div>
</div>

<!-- Modal to confirm the customer arrival in the lobby -->
<Modal bind:open={openArrivalModal} size="xs" autoclose outsideclose>
  <div class="text-center">
    <ExclamationCircleOutline
      class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
    />
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
        Are you in the lobby now?
    </h3>
    <Button color="red" class="me-2" on:click={notifyArrival}
      >Yes, I am here!</Button
    >
    <Button color="alternative">Cancel</Button>
  </div>
</Modal>
