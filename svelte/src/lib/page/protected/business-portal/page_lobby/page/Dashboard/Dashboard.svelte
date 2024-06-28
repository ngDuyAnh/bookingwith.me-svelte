<script>
  import {onMount} from "svelte";
  import Appointment
    from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Appointment/Appointment.svelte";
  import Lobby from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Lobby/Lobby.svelte";
  import Servicing
    from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/Servicing.svelte";
  import Completed
    from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Completed/Completed.svelte";
  import { customerBookingQueueList } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
  import {Button, Search, Spinner} from "flowbite-svelte";
  import CustomerBookingClickModal from "$lib/components/CustomerBookingClickModal/CustomerBookingClickModal.svelte";
  import {SearchOutline} from 'flowbite-svelte-icons';


  let filteredBookingStateList = [];
  let searchValue = '';

  let showSearchText = "";

  function normalize(text) {
    return text.replace(/[\W_]+/g, "").toLowerCase();
  }

  function searchBookings() {
    const normalizedSearchValue = normalize(searchValue);

    // Assume $customerBookingQueueList is structured like: [ [], [], [], [] ]
    // where each sub-array represents bookings in different states: 0->appointment, 1->lobby, 2->servicing, 3->completed
    if (searchValue.length == 0) {
      filteredBookingStateList = $customerBookingQueueList;
      showSearchText = "";
    } else {
      filteredBookingStateList = $customerBookingQueueList.map(state => {
        return state.filter(booking =>
                normalize(booking.customer.customerName).includes(normalizedSearchValue) ||
                normalize(booking.id.toString()).includes(normalizedSearchValue) ||
                normalize(booking.customer.phoneNumber.toString()).includes(normalizedSearchValue)
        );
      });
      showSearchText = `Showing Results For: ${searchValue}`;
    }


  }


  let loading = true;
  onMount(async () => {

    loading = false;
  });


  $: if (searchValue.length >= 0) {
    searchBookings();
  }

  $: if($customerBookingQueueList)
  {
     searchBookings();
  }

</script>

{#if loading}
  <div class="flex justify-center items-center h-screen">
    <Spinner/>
  </div>
{:else}


  <div class="flex sm:flex-row flex-col sm:items-center items-start justify-start sm:space-x-4 pt-4 px-4 2xl:items-center 2xl:justify-center">
    <form class="flex max-w-xs items-center" on:submit={searchBookings}>
      <Search bind:value={searchValue} size="md" class="rounded-none rounded-l-lg py-2.5"
              placeholder="Search Booking Info" maxlength="20">
      </Search>
      <Button type="submit" class="!p-2.5 rounded-s-none">
        <SearchOutline class="w-5 h-5"/>
      </Button>
    </form>

    <div class="!flex !flex-col">
      <strong class="sm:my-0 mt-1 text-sm">{showSearchText}</strong>
      <div class="sm:my-0 mt-1 text-xs">Appointment: <strong>{filteredBookingStateList[0].length}</strong>
        - Lobby: <strong>{filteredBookingStateList[1].length}</strong> - Service:
        <strong>{filteredBookingStateList[2].length}</strong> - Completed:
        <strong>{filteredBookingStateList[3].length}</strong></div>
    </div>
  </div>
  <div class="flex flex-row w-screen h-full justify-between 2xl:items-center 2xl:justify-center space-x-4 overflow-x-auto p-4">
    <Appointment
            bind:customerBookingQueueList={filteredBookingStateList}
    />
    <Lobby
            bind:customerBookingQueueList={filteredBookingStateList}
    />
    <Servicing
            bind:customerBookingQueueList={filteredBookingStateList}
    />
    <Completed
            bind:customerBookingQueueList={filteredBookingStateList}
    />
  </div>
{/if}

<!-- Modal for customer booking click -->
<CustomerBookingClickModal/>
