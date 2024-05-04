<script>
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {Button, Input, Label, Select, Textarea} from "flowbite-svelte";
    import {availableBooking} from "$lib/api/api_server/customer-booking-portal/api.js";
    import dayjs from "dayjs";
    import {onMount} from "svelte";
    import {getCustomer} from "$lib/api/api_server/lobby-portal/api.js";

    export let businessId;
    export let customerBooking;
    export let customerIndividualList;
    export let submit;
    export let customerNameAutoComplete = false;
    export let overrideFlag = false;

    let availableTimeOptionList = [];
    async function fetchAvailableTimeList() {
        let currentTimeString = "00:00";
        if (customerBooking.bookingDate === $now.format(formatToDate))
        {
            currentTimeString = $now.format(formatToTime)
        }

        try
        {
            const response = await availableBooking(
                businessId,
                customerBooking.bookingDate,
                currentTimeString,
                customerIndividualList
            );

            console.log("response", response);

            // Initialize the available time
            availableTimeOptionList = response.availableBookingList.map(
                timeString => {
                    return {
                        value: timeString,
                        name: dayjs(timeString, formatToTime).format(formatToTimeAM)
                    };
                });

            console.log("availableTimeOptionList", availableTimeOptionList)
        }
        catch (error)
        {
            console.log(error);
            availableTimeOptionList = [];
        }
    }

    let dateSelected = customerBooking.bookingDate;
    function getAvailableTimeOptionList()
    {
        // New date selected
        customerBooking.bookingDate = dateSelected;

        // Reset the time select
        customerBooking.bookingTime = null;

        // Get the new available time
        fetchAvailableTimeList();
    }

    // Initial fetch for availability
    onMount(async () =>{
        getAvailableTimeOptionList();
    })

    // Reactive statement to fetch times when the date changes
    $: if (dateSelected !== customerBooking.bookingDate) {
        getAvailableTimeOptionList();
    }

    function formatPhoneNumber(phoneNumber)
    {
        let formattedPhoneNumber = "";
        // Format as "(123) 456-7890"
        if (phoneNumber.length > 6) {
            // If more than 6 digits, format with parenthesis and dash
            formattedPhoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
        } else if (phoneNumber.length > 3) {
            // If more than 3 digits, include parenthesis
            formattedPhoneNumber = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        } else if (phoneNumber.length > 0) {
            // If 1-3 digits, just wrap in parentheses
            formattedPhoneNumber = `(${phoneNumber}`;
        } else {
            // Empty input
            formattedPhoneNumber = '';
        }

        // Return
        return formattedPhoneNumber;
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
        const input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
        value = value.slice(0, 10); // Limit to 10 digits

        // Update the raw customer phone number
        customerBooking.customer.phoneNumber = value;

        // Format as "(123) 456-7890"
        formattedPhoneNumber = formatPhoneNumber(value);

        // When the formatted phone number is complete, fetch the customer name
        if (value.length === 10) {
            customerExists();
        }
    }
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

    <Button type="submit" class="w-full">
        Submit
    </Button>
</form>
