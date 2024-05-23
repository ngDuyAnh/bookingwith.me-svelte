<script>
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {Button, Input, Label, Select, Textarea} from "flowbite-svelte";
    import {
        availability,
        forceSubmitBooking,
        submitBooking
    } from "$lib/api/api_server/customer-booking-portal/api.js";
    import dayjs from "dayjs";
    import {onMount} from "svelte";
    import {getCustomer} from "$lib/api/api_server/lobby-portal/api.js";
    import {
        CustomerBookingState
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {send_SMS_BookingSuccess} from "$lib/api/api_twilio/api.js";
    import {rawPhoneNumber, formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";

    export let customerNameAutoComplete = false;
    export let requiredAgreeToReceiveSMS = true;

    export let businessInfo;
    // export let businessName;
    export let customerBooking;

    export let submitCallback = undefined;

    export let overrideFlag = false;
    export let sendSMSFlag = false;

    let walkinAvailabilityFlag = false;

    let currentTimeString = "00:00";
    let availableTimeOptionList = [];
    async function fetchAvailableTimeList()
    {
        // Empty
        availableTimeOptionList = [];

        const bookingDate = dayjs(customerBooking.bookingDate, formatToDate);
        currentTimeString = "00:00"; // Booking date is in the future
        if (bookingDate.isSame($now, 'day'))
        {
            currentTimeString = $now.format(formatToTime)
        }
        // Invalid, the date selected is before today
        // Set it to the end of the day for no availability
        else if (bookingDate.isBefore($now, 'day'))
        {
            currentTimeString = "23:59";
        }

        try
        {
            let response = {};

            if (walkinAvailabilityFlag)
            {
                customerBooking.bookingState = CustomerBookingState.APPOINTMENT;

                // Get the availabilities
                response = await availability(
                    businessInfo.businessID,
                    customerBooking.bookingDate,
                    currentTimeString,
                    customerBooking,
                    5
                );

                // Initialize the available time
                availableTimeOptionList = response.availabilityList.map(
                    availability => {
                        return {
                            value: availability.timePeriod.startTime,
                            name: `${dayjs(availability.timePeriod.startTime, formatToTime).format(formatToTimeAM)} to ${dayjs(availability.timePeriod.endTime, formatToTime).format(formatToTimeAM)} (${availability.duration} minutes)`,
                            availability: availability
                        };
                    });
            }
            else
            {
                customerBooking.bookingState = CustomerBookingState.SCHEDULE;

                // Get the availabilities
                response = await availability(
                    businessInfo.businessID,
                    customerBooking.bookingDate,
                    currentTimeString,
                    customerBooking,
                    10
                );

                // Initialize the available time
                availableTimeOptionList = response.availabilityList.map(
                    availability => {
                        return {
                            value: availability.timePeriod.startTime,
                            name: `${dayjs(availability.timePeriod.startTime, formatToTime).format(formatToTimeAM)}`,
                            availability: availability
                        };
                    });
            }

            // Currently the walk-in availability flag is not selected
            if (!walkinAvailabilityFlag)
            {
                // Add the option to fetch walk-in availability
                if (availableTimeOptionList.length > 0)
                {
                    availableTimeOptionList.push({
                        value: undefined,
                        name: "Show more availability...",
                        availability: undefined
                    });
                }
                // No availability
                // Search for walk-in availability
                else if (availableTimeOptionList.length === 0)
                {
                    walkinAvailabilityFlag = true;
                    await fetchAvailableTimeList();
                }
            }

            //console.log("availableTimeOptionList", availableTimeOptionList)
        }
        catch (error)
        {
            console.log(error);
            availableTimeOptionList = [];
        }
    }

    // Show more availability is selected
    // Fetch the walk-in availability
    let selectedAvailability = undefined;
    $: selectedAvailability = availableTimeOptionList.find(option => option.value === customerBooking.bookingTime)?.availability;
    $: if (customerBooking.bookingTime === undefined)
    {
        // Reset
        customerBooking.bookingTime = null;

        // Fetch walk-in availability
        walkinAvailabilityFlag = true;
        fetchAvailableTimeList();
    }

    let dateSelected = customerBooking.bookingDate;
    function getAvailableTimeOptionList()
    {
        // New date selected
        customerBooking.bookingDate = dateSelected;

        // Reset
        walkinAvailabilityFlag = false;
        customerBooking.bookingTime = null;
        selectedAvailability = undefined;

        // Get the new available time
        fetchAvailableTimeList();
    }

    // Initial fetch for availability
    onMount(async () =>{
        getAvailableTimeOptionList();
    })

    // Reactive statement to fetch times when the date changes
    $: if (dateSelected !== customerBooking.bookingDate)
    {
        // Fetch availability
        getAvailableTimeOptionList();
    }

    async function customerExists()
    {
        if (customerNameAutoComplete)
        {
            const customer = await getCustomer(customerBooking.customer.phoneNumber);
            if (customer && customer.customerName)
            {
                customerBooking.customer.customerName = customer.customerName;
            }
        }
    }

    let formattedPhoneNumber = formatPhoneNumber(customerBooking.customer.phoneNumber);

    function handleBusinessPhoneNumberInput(event) {
        const input = event.target.value;

        // Update the raw customer phone number
        customerBooking.customer.phoneNumber = rawPhoneNumber(input);

        // Format as "(123) 456-7890"
        formattedPhoneNumber = formatPhoneNumber(input);

        // When the formatted phone number is complete, fetch the customer name
        if (customerBooking.customer.phoneNumber.length === 10) {
            customerExists();
        }
    }

    async function submit()
    {
        console.log("submit()", customerBooking);

        let success = false;
        let error = false;

        try
        {
            let response = {};

            // Initialize customer booking
            customerBooking.bookingState = CustomerBookingState.APPOINTMENT;

            // Force submit if override is toggled
            if (overrideFlag)
            {
                response = await forceSubmitBooking(
                    businessInfo.businessID,
                    customerBooking
                );
            }
            // Submit appointment
            else
            {
                // Synchronize servicing
                // Submit appointment aim to schedule to be service at the same time
                if (!walkinAvailabilityFlag)
                {
                    customerBooking.bookingState = CustomerBookingState.SCHEDULE;
                }

                response = await submitBooking(
                    businessInfo.businessID,
                    currentTimeString,
                    selectedAvailability.timePeriod,
                    customerBooking
                );
            }

            // Success
            if (response.submitted)
            {
                success = true;

                // Send SMS
                if (sendSMSFlag) {
                    try {
                        await send_SMS_BookingSuccess(businessInfo.businessName, response.customerBooking);
                    } catch (error) {
                        console.error("Failed to send SMS message.", error);
                    }
                }
            }
        }
        catch (err)
        {
            error = true;
            console.error("Error submitting booking:", err);
        }

        // Call the callback function for submit
        if (submitCallback)
        {
            submitCallback(success, error);
        }
    }

    let isConsentChecked = false;
</script>

<form on:submit|preventDefault={submit} class="space-y-4">
    <Label class="space-y-2">
        <span>Phone Number:</span>
        <Input
                id="phoneNumber"
                type="tel"
                placeholder="(123) 456-7890"
                bind:value={formattedPhoneNumber}
                on:input={handleBusinessPhoneNumberInput}
                required
                pattern="\(\d\d\d\) \d\d\d-\d\d\d\d"
                title="Phone number must be in the format: (123) 456-7890"
        />
    </Label>

    <Label class="space-y-2">
        <span>Name:</span>
        <Input
                id="customerName"
                bind:value={customerBooking.customer.customerName}
                required
        />
    </Label>

    <Label class="space-y-2">
        <span>Date:</span>
        <Input
                id="date"
                type="date"
                min={$now.format(formatToDate)}
                bind:value={dateSelected}
                required
        />
    </Label>

    <Label class="space-y-2">
        <span>Time:</span>
        {#if overrideFlag}
            <Input
                    type="time"
                    bind:value={customerBooking.bookingTime}
                    class="w-full"
                    placeholder="Enter Time"
                    required
            />
        {:else}
            <Select
                    id="time"
                    placeholder="Select a time"
                    items={availableTimeOptionList}
                    bind:value={customerBooking.bookingTime}
                    required
            />
        {/if}
    </Label>

    <Label class="space-y-2">
        <span>Message:</span>
        <Textarea
                id="message"
                placeholder="Enter any message or note here..."
                rows="5"
                bind:value={customerBooking.message}
        />
    </Label>

    {#if requiredAgreeToReceiveSMS}
        <Label class="space-y-2">
            <input type="checkbox"
                   bind:checked={isConsentChecked}
                   required
                   id="smsConsentCheckbox" />
            <span> I agree to receive SMS messages about my appointment.</span>
        </Label>
    {/if}

    <Button type="submit" class="w-full">
        Submit
    </Button>
</form>
