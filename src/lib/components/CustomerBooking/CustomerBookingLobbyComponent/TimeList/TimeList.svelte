<script>
    import {fetchAvailableTimeList} from "$lib/api/api_server/functions.js";
    import {isToday} from "$lib/page/stores/now/now_dayjs_store.js";
    import {Alert, Button, Search, Spinner} from "flowbite-svelte";
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {normalizeSearchInput} from "$lib/application/NormalizeSearchInput.js";
    import {fly} from "svelte/transition";
    import {ExclamationCircleOutline, InfoCircleSolid} from "flowbite-svelte-icons";

    export let customerBooking;

    // Walk-in flag
    // If the booking time is today, enforce the walk-in availabilities
    let walkin = false;
    $: walkin = isToday(customerBooking.bookingDate);

    // Serialize to track deep changes in nested structures
    let requiredAvailabilitiesSearch = true;
    let beforeSerializedBooking = {
        bookingDate: customerBooking.bookingDate,
        customerIndividualBookingList: customerBooking.customerIndividualBookingList
    };
    let serializedBooking = JSON.stringify(beforeSerializedBooking);
    $: {
        const currentBeforeSerialized = {
            bookingDate: customerBooking.bookingDate,
            customerIndividualBookingList: customerBooking.customerIndividualBookingList
        };
        const currentSerialized = JSON.stringify(currentBeforeSerialized);
        if (serializedBooking !== currentSerialized) {
            requiredAvailabilitiesSearch = true; // Trigger the UI to show the re-fetch button

            // If it is date change, automatically perform the availability search
            if (beforeSerializedBooking.bookingDate !== currentBeforeSerialized.bookingDate) {
                getAvailabilities();
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

    // Array to store indices of bookings with empty service lists
    let emptyServiceBookingIndices = [];

    // Loop through the list and check the length of customerIndividualServiceBookingList

    let showAlert = false;
    let alertMsg = '';
    let fetching = false;

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

        if (emptyServiceBookingIndices.length == 0) {
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
                }).finally(() => {
                fetching = false;
            });
        } else {
            showAlert = true;
            if (emptyServiceBookingIndices.length <= 4) {
                if (emptyServiceBookingIndices.length === 4) {
                    alertMsg = `Guests # ${emptyServiceBookingIndices.slice(0, -1).join(', ')} & ${emptyServiceBookingIndices.slice(-1)} have not selected a service.`;
                } else {
                    alertMsg = `Guest${emptyServiceBookingIndices.length > 1 ? 's' : ''} # ${emptyServiceBookingIndices.join(' & ')} ${emptyServiceBookingIndices.length > 1 ? 'have' : 'has'} not selected a service.`;
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
                return (selectedAvailability === availability) ||
                    normalizeSearchInput(displayString).includes(
                        normalizedSearchValue
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
                return (matchIndexA !== -1 ? matchIndexA : Infinity) - (matchIndexB !== -1 ? matchIndexB : Infinity);
            });
        }
    }

    function selectAvailability(availability) {
        selectedAvailability = availability;
        customerBooking.bookingTime = availability.timePeriod.startTime;
        // console.log("Selected time: ", customerBooking.bookingTime);
    }

    function availabilityString(availability) {
        const startTimeFormatted = dayjs(availability.timePeriod.startTime, formatToTime).format(formatToTimeAM);
        const endTimeFormatted = dayjs(availability.timePeriod.endTime, formatToTime).format(formatToTimeAM);
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
    <Button on:click={getAvailabilities} class="mt-1">
        Check Availability
    </Button>
{:else}
    {#if showAlert}
        <!--Alert for moving to customer booking information but at least a guest has not selected a service-->
        <Alert class="{showAlert?'':'hidden'}" dismissable={false} params={{ x: 200 }} transition={fly}>
            <InfoCircleSolid class="w-5 h-5 ripple" slot="icon"/>
            {alertMsg}
        </Alert>
    {:else if fetching}
        <Spinner class="h-[100px] w-fit my-auto"/>
    {:else if filteredAvailabilityList.length > 0}
        <ul class="space-y-2 w-full overflow-x-hidden">
            {#each filteredAvailabilityList as availability, index (index)}
                <li id={index}
                    class="flex justify-between items-center py-1 px-1 rounded-md shadow-sm
                    {selectedAvailability === availability ? (availability.walkIn ? 'border-[3px] border-red-700' : 'border-[3px] border-blue-700') : ''}
                    {availability.walkIn ? 'bg-yellow-200' : 'bg-green-200'}"
                >
                    <button
                            class="flex-1 text-left cursor-pointer"
                            on:click={() => selectAvailability(availability)}
                    >
                        {availabilityString(availability)}
                    </button>
            {/each}
        </ul>
    {:else if !fetching}
        <p class="flex flex-row items-center select-none text-center text-lg py-4 text-gray-500">
            <ExclamationCircleOutline size="lg" class="text-gray-500 mr-2"/> No availability.
        </p>
    {/if}

{/if}
