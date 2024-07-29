<script>
    import {fetchAvailableTimeList} from "$lib/api/api_server/functions.js";
    import {Alert, Search, Spinner} from "flowbite-svelte";
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {normalizeSearchInput} from "$lib/application/NormalizeSearchInput.js";
    import {fly} from "svelte/transition";
    import {
        ExclamationCircleOutline,
        InfoCircleSolid,
    } from "flowbite-svelte-icons";
    import {
        availabilityFetched, selectAvailability
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";
    import {
        updateCurrentTime
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";
    import {nowTime} from "$lib/page/stores/now/now.js";
    import {
        pleaseFetchAvailability
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";
    import {
        customerBookingLobbyComponent
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";

    export let customerBooking;

    // Serialize to track deep changes in nested structures
    let requiredAvailabilitiesSearch = true;
    let beforeSerializedBooking = {
        bookingDate: $customerBookingLobbyComponent.bookingDate,
        customerIndividualBookingList: customerBooking.customerIndividualBookingList
    };
    let serializedBooking = JSON.stringify(beforeSerializedBooking);
    $: {
        const currentBeforeSerialized = {
            bookingDate: $customerBookingLobbyComponent.bookingDate,
            customerIndividualBookingList: customerBooking.customerIndividualBookingList
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
                selectAvailability(undefined)
            }

            // Update the stored serialized form
            beforeSerializedBooking = currentBeforeSerialized;
            serializedBooking = currentSerialized;
        }
    }

    // Select booking time
    let availabilityList = [];

    // Array to store indices of bookings with empty service lists
    let emptyServiceBookingIndices = [];

    // Loop through the list and check the length of customerIndividualServiceBookingList

    let showAlert = false;
    let alertMsg = "";
    let fetching = false;

    $: if ($customerBookingLobbyComponent.pleaseFetchAvailability) {

        availabilityFetched();

        console.log("Here in fetching availabilities", $customerBookingLobbyComponent.pleaseFetchAvailability)

        getAvailabilities();
    }

    function getAvailabilities() {

        showAlert = false;
        alertMsg = "";

        // Get the indices of the guest that have not selected a service
        emptyServiceBookingIndices = [];
        customerBooking.customerIndividualBookingList.forEach((booking, index) => {
            if (booking.customerIndividualServiceBookingList.length === 0) {
                emptyServiceBookingIndices.push(index + 1);
            }
        });

        // All guests selected at least a service
        // Proceed with getting the availabilities
        if (emptyServiceBookingIndices.length === 0) {
            // Record current timestamp to submit the customer booking later based on it
            // This will prevent conflict submit due to the time passing while the customer make the decision
            updateCurrentTime(nowTime());

            // Cloned
            const clonedCustomerBooking = JSON.parse(JSON.stringify(customerBooking))

            // Initialize the booking date and time
            clonedCustomerBooking.bookingDate = $customerBookingLobbyComponent.bookingDate;

            // Get the availabilities
            fetching = true;
            fetchAvailableTimeList(clonedCustomerBooking, true)
                .then((availabilities) => {

                    // Reset the availability list
                    availabilityList = [];

                    // If it is editing customer booking
                    // The search availability date is the existing booking date
                    // Then add a default option
                    // Show the default time of the customer booking
                    if (customerBooking.id !== -1 &&
                        $customerBookingLobbyComponent.bookingDate === customerBooking.bookingDate) {
                        availabilityList = [
                            {
                                timePeriod: {
                                    startTime: customerBooking.bookingTime,
                                    endTime: customerBooking.bookingTime
                                },
                                duration: 0,
                                walkIn: true,

                                override: true
                            }
                        ];
                    }

                    // Add the availabilities to the list
                    availabilityList.push(...availabilities);

                    // Select the first booking time
                    if (availabilityList.length > 0) {
                        selectAvailability(availabilityList[0]);
                    }
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
                    $customerBookingLobbyComponent.selectedAvailability === availability ||
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
                if ($customerBookingLobbyComponent.selectedAvailability === a) return -1;
                if ($customerBookingLobbyComponent.selectedAvailability === b) return 1;

                // Sort by the match index; earlier matches are better
                // If no match found (index = -1), push to the end
                return (
                    (matchIndexA !== -1 ? matchIndexA : Infinity) -
                    (matchIndexB !== -1 ? matchIndexB : Infinity)
                );
            });
        }
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

{#if requiredAvailabilitiesSearch}
    <button
            on:click={pleaseFetchAvailability}
            on:mouseenter={pleaseFetchAvailability}
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
                class=" fill-current text-black hover:text-blue-500 w-3/6 h-5/6"
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
    </svg>

        <span class=" animate-pulse font-bold text-black text-xl">
      Check Availability
    </span>
    </button>
{:else if showAlert}
    <!--Alert for moving to customer booking information but at least a guest has not selected a service-->
    <Alert
            class="{showAlert ? '' : 'hidden'} rounded-none w-full flex justify-center"
            dismissable={false}
            params={{ x: 200 }}
            transition={fly}
    >
        <InfoCircleSolid class="w-5 h-5 ripple" slot="icon"/>
        {alertMsg}
    </Alert>
{:else if fetching}
    <Spinner class="h-[100px] w-fit my-auto"/>
{:else if filteredAvailabilityList.length > 0}
    <Search
            bind:value={searchValue}
            size="md"
            class="rounded-b-none py-2.5"
            placeholder="Search Time Info"
            maxlength="20"
    ></Search>
    <span class="font-semibold flex w-full items-center justify-center bg-white border-[1px] border-[#d1d5db] rounded-b mb-1">Availability for {$customerBookingLobbyComponent.bookingDate}</span>
    <ul class="space-y-2 w-full overflow-x-hidden justify-center">
        {#each filteredAvailabilityList as availability, index (index)}
            {#if availability.override}
                <!--Override option show the colour red-->
                <li
                        id={index}
                        class="bg-red-200 flex justify-between items-center py-1 px-1 rounded-md shadow-sm
                    {$customerBookingLobbyComponent.selectedAvailability === availability ? 'border-[3px] border-red-700' : ''}"
                >
                    <button
                            class="flex-1 text-left cursor-pointer"
                            on:click={() => selectAvailability(availability)}
                    >
                        {dayjs(availability.timePeriod.startTime, formatToTime).format(formatToTimeAM)}
                    </button>
                </li>
            {:else}
                <li
                        id={index}
                        class="flex justify-between items-center py-1 px-1 rounded-md shadow-sm
                    {$customerBookingLobbyComponent.selectedAvailability === availability
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
                </li>
            {/if}
        {/each}
    </ul>
{:else if !fetching}
    <span class="font-semibold flex w-full items-center justify-center w-full bg-white border-[1px] border-[#d1d5db]">Availability for {$customerBookingLobbyComponent.bookingDate}</span>
    <p
            class="flex flex-row items-center select-none text-center text-lg py-4 text-gray-500"
    >
        <ExclamationCircleOutline size="lg" class="text-gray-500 mr-2"/>
        No availability.
    </p>
{/if}


