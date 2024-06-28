<script>
  import CustomerBookingList from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingList.svelte";
  import { customerBookingQueueList } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
  import { handleNewCustomerBookingWalkin } from "$lib/components/Modal/CreateCustomerBooking/modalCreateCustomerBooking.js";
</script>

<div
  class="min-w-[348.4px] h-full bg-gray-100 rounded shadow p-4 overflow-y-auto border border-sky-200"
>
  <!-- List Header -->
  <div class="px-4 py-2 flex items-center justify-between select-none">
    <h2 class="text-lg font-bold">{"Lobby"}</h2>

    <div class="flex items-center space-x-4">
      <span class="text-sm">{$customerBookingQueueList[1].length}</span>

      <button
        on:click={handleNewCustomerBookingWalkin}
        class="text-blue-500 hover:text-blue-700 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  </div>

  <CustomerBookingList customerBookingList={$customerBookingQueueList[1]} />
</div>
