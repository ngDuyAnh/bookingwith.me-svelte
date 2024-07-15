<script>
  import { fetchAvailableTimeList } from "$lib/api/api_server/functions.js";
  import { isToday } from "$lib/page/stores/now/now_dayjs_store.js";
  import { Alert, Search, Spinner } from "flowbite-svelte";
  import dayjs from "dayjs";
  import { formatToTime, formatToTimeAM } from "$lib/application/Formatter.js";
  import { normalizeSearchInput } from "$lib/application/NormalizeSearchInput.js";
  import { fly } from "svelte/transition";
  import {
    ExclamationCircleOutline,
    InfoCircleSolid,
  } from "flowbite-svelte-icons";
  import {
    availabilityFetched,
    modalCreateCustomerBookingLobby,
    updateBookingTimePeriod,
    updateCurrentTimeString,
  } from "$lib/components/Modal/CreateCustomerBookingLobby/stores/createCustomerBookingLobby.js";
  import { nowTime } from "$lib/page/stores/now/now_dayjs_store.js";
  import { pleaseFetchAvailability } from "$lib/components/Modal/CreateCustomerBookingLobby/stores/createCustomerBookingLobby.js";

  export let customerBooking;

  // Walk-in flag
  // If the booking time is today, enforce the walk-in availabilities
  let walkin = false;
  $: walkin = isToday(customerBooking.bookingDate);

  // Serialize to track deep changes in nested structures
  let requiredAvailabilitiesSearch = true;
  let beforeSerializedBooking = {
    bookingDate: customerBooking.bookingDate,
    customerIndividualBookingList:
      customerBooking.customerIndividualBookingList,
  };
  let serializedBooking = JSON.stringify(beforeSerializedBooking);
  $: {
    const currentBeforeSerialized = {
      bookingDate: customerBooking.bookingDate,
      customerIndividualBookingList:
        customerBooking.customerIndividualBookingList,
    };
    const currentSerialized = JSON.stringify(currentBeforeSerialized);
    if (serializedBooking !== currentSerialized) {
      requiredAvailabilitiesSearch = true; // Trigger the UI to show the re-fetch button

      // If it is date change, automatically perform the availability search
      if (
        beforeSerializedBooking.bookingDate !==
        currentBeforeSerialized.bookingDate
      ) {
        pleaseFetchAvailability();
      }
      // Reset
      else {
        availabilityList = [];
        selectedAvailability = undefined;
        customerBooking.bookingTime = null;
      }

      // Update the stored serialized form
      beforeSerializedBooking = currentBeforeSerialized;
      serializedBooking = currentSerialized;
    }
  }

  // Select booking time
  let availabilityList = [];
  let selectedAvailability = undefined;

  // Record the selected booking time period
  // This is to make sure the consistency when submitting to the server
  // That we can lock the time period for the customer booking
  $: updateBookingTimePeriod(selectedAvailability?.timePeriod);

  // Array to store indices of bookings with empty service lists
  let emptyServiceBookingIndices = [];

  // Loop through the list and check the length of customerIndividualServiceBookingList

  let showAlert = false;
  let alertMsg = "";
  let fetching = false;

  $: if ($modalCreateCustomerBookingLobby.pleaseFetchAvailability) {
    getAvailabilities();
    availabilityFetched();
  }

  function getAvailabilities() {
    showAlert = false;
    alertMsg = "";

    emptyServiceBookingIndices = [];
    customerBooking.customerIndividualBookingList.forEach((booking, index) => {
      if (booking.customerIndividualServiceBookingList.length === 0) {
        emptyServiceBookingIndices.push(index + 1);
      }
    });

    console.log("emptyServiceBookingIndices", emptyServiceBookingIndices);

    // console.log("getAvailabilities customerBooking", customerBooking);

    if (emptyServiceBookingIndices.length === 0) {
      // Record current timestamp to submit the customer booking later based on it
      // This will prevent conflict submit due to the time passing while the customer make the decision
      updateCurrentTimeString(nowTime());

      // Get the availabilities
      fetching = true;
      fetchAvailableTimeList(customerBooking, walkin)
        .then((availabilities) => {
          availabilityList = availabilities;

          // Select the first booking time
          if (availabilityList.length > 0) {
            selectAvailability(availabilityList[0]);
          }

          // console.log("availabilityList", availabilityList)
        })
        .catch((err) => {
          console.error("Error getAvailabilities():", err);
        })
        .finally(() => {
          fetching = false;
        });
    } else {
      showAlert = true;
      if (emptyServiceBookingIndices.length <= 4) {
        if (emptyServiceBookingIndices.length === 4) {
          alertMsg = `Guests # ${emptyServiceBookingIndices.slice(0, -1).join(", ")} & ${emptyServiceBookingIndices.slice(-1)} have not selected a service.`;
        } else {
          alertMsg = `Guest${emptyServiceBookingIndices.length > 1 ? "s" : ""} # ${emptyServiceBookingIndices.join(" & ")} ${emptyServiceBookingIndices.length > 1 ? "have" : "has"} not selected a service.`;
        }
      } else {
        alertMsg = `${emptyServiceBookingIndices.length} guests have not selected a service.`;
      }
    }

    requiredAvailabilitiesSearch = false;
  }

  // Filter search
  let searchValue = "";
  let filteredAvailabilityList = [];

  // Searching input changes
  // Timetable update generate events for calendar
  $: if (searchValue.length >= 0 || availabilityList) {
    searchTime();
  }

  function searchTime() {
    const normalizedSearchValue = normalizeSearchInput(searchValue);

    if (searchValue.length === 0) {
      filteredAvailabilityList = availabilityList;
    } else {
      // Filter based on the search value
      filteredAvailabilityList = availabilityList.filter((availability) => {
        const displayString = availabilityString(availability);

        // The display string include the search
        // Or it is the selected availability
        return (
          selectedAvailability === availability ||
          normalizeSearchInput(displayString).includes(normalizedSearchValue)
        );
      });

      // Sort the filtered list based on the index of match
      filteredAvailabilityList.sort((a, b) => {
        const displayStringA = normalizeSearchInput(availabilityString(a));
        const displayStringB = normalizeSearchInput(availabilityString(b));

        // Calculate match position for each item
        const matchIndexA = displayStringA.indexOf(normalizedSearchValue);
        const matchIndexB = displayStringB.indexOf(normalizedSearchValue);

        // If one or both items are the selected availability, prioritize them
        if (selectedAvailability === a) return -1;
        if (selectedAvailability === b) return 1;

        // Sort by the match index; earlier matches are better
        // If no match found (index = -1), push to the end
        return (
          (matchIndexA !== -1 ? matchIndexA : Infinity) -
          (matchIndexB !== -1 ? matchIndexB : Infinity)
        );
      });
    }
  }

  function selectAvailability(availability) {
    selectedAvailability = availability;
    customerBooking.bookingTime = availability.timePeriod.startTime;
    // console.log("Selected time: ", customerBooking.bookingTime);
  }

  function availabilityString(availability) {
    const startTimeFormatted = dayjs(
      availability.timePeriod.startTime,
      formatToTime
    ).format(formatToTimeAM);
    const endTimeFormatted = dayjs(
      availability.timePeriod.endTime,
      formatToTime
    ).format(formatToTimeAM);
    const durationDisplay = availability.walkIn
      ? `(~${availability.duration} minutes)`
      : `(${availability.duration} minutes)`;

    return `${startTimeFormatted} to ${endTimeFormatted} ${durationDisplay}`;
  }
</script>

<!--Maybe add loading here while getting the availabilities-->

<Search
  bind:value={searchValue}
  size="md"
  class="rounded-none py-2.5"
  placeholder="Search Booking Info"
  maxlength="20"
></Search>

{#if requiredAvailabilitiesSearch}
  <button
    on:click={getAvailabilities}
    on:mouseenter={getAvailabilities}
    class="focus:outline-none w-full h-full flex flex-col justify-center items-center shadow p-1 rounded-lg stripeBG"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 25 25"
      style="enable-background:new 0 0 25 25;"
      xml:space="preserve"
      class=" fill-current text-black hover:text-blue-500 w-5/6"
    >
      <path
        stroke-width="0.01"
        stroke="currentColor"
        d="M20,10.5c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5C21,4.71,16.29,0,10.5,0S0,4.71,0,10.5S4.71,21,10.5,21  c0.276,0,0.5-0.224,0.5-0.5S10.776,20,10.5,20C5.262,20,1,15.738,1,10.5S5.262,1,10.5,1S20,5.262,20,10.5z"
      />
      <path
        stroke-width="0.01"
        stroke="currentColor"
        d="M10.5,3.141c-0.276,0-0.5,0.224-0.5,0.5V10.5c0,0.276,0.224,0.5,0.5,0.5h4.728c0.276,0,0.5-0.224,0.5-0.5  s-0.224-0.5-0.5-0.5H11V3.641C11,3.364,10.776,3.141,10.5,3.141z"
      />
      <path
        stroke-width="0.01"
        stroke="currentColor"
        d="M21.594,20.887c0.678-0.834,1.102-1.883,1.102-3.039c0-2.673-2.175-4.848-4.848-4.848S13,15.175,13,17.848  s2.175,4.848,4.848,4.848c1.156,0,2.205-0.424,3.039-1.102l2.26,2.26C23.244,23.951,23.372,24,23.5,24s0.256-0.049,0.354-0.146  c0.195-0.195,0.195-0.512,0-0.707L21.594,20.887z M17.848,21.696c-2.122,0-3.848-1.726-3.848-3.848S15.726,14,17.848,14  s3.848,1.726,3.848,3.848C21.695,19.97,19.97,21.696,17.848,21.696z"
      />
      <text
        x="0"
        y="39"
        fill="#000000"
        font-size="5px"
        font-weight="bold"
        font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
        >Created by Royyan Wijaya</text
      >
      <text
        x="0"
        y="44"
        fill="#000000"
        font-size="5px"
        font-weight="bold"
        font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
        >from the Noun Project</text
      >
    </svg>

    <span class=" animate-pulse font-bold text-black text-xl">
      Check Availability
    </span>
  </button>
{:else if showAlert}
  <!--Alert for moving to customer booking information but at least a guest has not selected a service-->
  <Alert
    class={showAlert ? "" : "hidden"}
    dismissable={false}
    params={{ x: 200 }}
    transition={fly}
  >
    <InfoCircleSolid class="w-5 h-5 ripple" slot="icon" />
    {alertMsg}
  </Alert>
{:else if fetching}
  <Spinner class="h-[100px] w-fit my-auto" />
{:else if filteredAvailabilityList.length > 0}
  <ul class="space-y-2 w-full overflow-x-hidden">
    {#each filteredAvailabilityList as availability, index (index)}
      <li
        id={index}
        class="flex justify-between items-center py-1 px-1 rounded-md shadow-sm
                    {selectedAvailability === availability
          ? availability.walkIn
            ? 'border-[3px] border-red-700'
            : 'border-[3px] border-blue-700'
          : ''}
                    {availability.walkIn ? 'bg-yellow-200' : 'bg-green-200'}"
      >
        <button
          class="flex-1 text-left cursor-pointer"
          on:click={() => selectAvailability(availability)}
        >
          {availabilityString(availability)}
        </button>
      </li>{/each}
  </ul>
{:else if !fetching}
  <p
    class="flex flex-row items-center select-none text-center text-lg py-4 text-gray-500"
  >
    <ExclamationCircleOutline size="lg" class="text-gray-500 mr-2" />
    No availability.
  </p>
{/if}

<style>
  .stripeBG {
    background-image: linear-gradient(
      45deg,
      #ebebeb 25%,
      #ffffff 25%,
      #ffffff 50%,
      #ebebeb 50%,
      #ebebeb 75%,
      #ffffff 75%,
      #ffffff 100%
    );
    background-size: 36.77px 36.77px;
  }

  .sjhwj {
    background: rgba(62, 255, 0, 0.58);
  }
</style>
