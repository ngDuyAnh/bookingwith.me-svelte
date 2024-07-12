<script>
    import {fetchAvailableTimeList} from "$lib/api/api_server/functions.js";
    import {isToday} from "$lib/page/stores/now/now_dayjs_store.js";
    import {Button, Search} from "flowbite-svelte";
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {normalizeSearchInput} from "$lib/application/NormalizeSearchInput.js";

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
            if (beforeSerializedBooking.bookingDate !== currentBeforeSerialized.bookingDate)
            {
                getAvailabilities();
            }
            // Reset
            else
            {
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

    function getAvailabilities()
    {
        fetchAvailableTimeList(customerBooking, walkin)
            .then((availabilities) => {
                requiredAvailabilitiesSearch = false;
                availabilityList = availabilities;

                // Select the first booking time
                if (availabilityList.length > 0)
                {
                    selectAvailability(availabilityList[0]);
                }

                // console.log("availabilityList", availabilityList)
            })
            .catch((err) => {
                console.error("Error getAvailabilities():", err);
            });
    }

    // Filter search
    let searchValue = "";
    let filteredAvailabilityList = [];

    // Searching input changes
    // Timetable update generate events for calendar
    $: if (searchValue.length >= 0 || availabilityList) {
        searchTime();
    }

    function searchTime()
    {
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
        class="rounded-none rounded-l-lg py-2.5"
        placeholder="Search Booking Info"
        maxlength="20"
></Search>

{#if requiredAvailabilitiesSearch}
    <Button on:click={getAvailabilities}>
        Check Availability
    </Button>
{:else}
    {#if filteredAvailabilityList.length > 0}
        <ul class="space-y-2">
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
    {:else}
        <p class="select-none">No availability.</p>
    {/if}
{/if}
