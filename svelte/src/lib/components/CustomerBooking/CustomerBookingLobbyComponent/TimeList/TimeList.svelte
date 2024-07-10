<script>
    import {fetchAvailableTimeList} from "$lib/api/api_server/functions.js";
    import {isToday} from "$lib/page/stores/now/now_dayjs_store.js";
    import {Button} from "flowbite-svelte";
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";

    export let customerBooking;

    // Walk-in flag
    // If the booking time is today, enforce the walk-in availabilities
    let walkin = false;
    $: walkin = isToday(customerBooking.bookingDate);

    // Serialize to track deep changes in nested structures
    let requiredAvailabilitiesSearch = true;
    let serializedBooking = JSON.stringify({
        bookingDate: customerBooking.bookingDate,
        customerIndividualBookingList: customerBooking.customerIndividualBookingList
    });
    $: {
        const currentSerialized = JSON.stringify({
            bookingDate: customerBooking.bookingDate,
            customerIndividualBookingList: customerBooking.customerIndividualBookingList
        });
        if (serializedBooking !== currentSerialized) {
            requiredAvailabilitiesSearch = true; // Trigger the UI to show the re-fetch button
            serializedBooking = currentSerialized; // Update the stored serialized form

            // Reset
            availabilityList = [];
            selectedAvailability = undefined;
            customerBooking.bookingTime = null;
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

                console.log("availabilityList", availabilityList)
            })
            .catch((err) => {
                console.error("Error getAvailabilities():", err);
            });
    }

    function selectAvailability(availability) {
        selectedAvailability = availability;
        customerBooking.bookingTime = availability.timePeriod.startTime;
        console.log("Selected time: ", customerBooking.bookingTime);
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

{#if requiredAvailabilitiesSearch}
    <Button on:click={getAvailabilities}>
        Check Availability
    </Button>
{:else if availabilityList.length > 0}
    <ul class="space-y-2">
        {#each availabilityList as availability, index (index)}
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
    <p>No availability.</p>
{/if}
