<script>
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {Button, Input, Label, Select, Textarea} from "flowbite-svelte";
    import {
        availability,
        forceSubmitBooking, initializeCustomerBooking,
        submitBooking
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import dayjs from "dayjs";
    import {onMount} from "svelte";
    import {getCustomer} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {
        CustomerBookingState
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {sendSmsConfirmBookingSuccess} from "$lib/api/api_twilio/functions.js";
    import {rawPhoneNumber, formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {sendSmsBookingReminder} from "$lib/api/api_twilio/functions.js";
    import {
        moveToLobby
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {isToday} from "$lib/page/stores/now/now_dayjs_store.js";

    export let customerBookingInformationFormProps;

    export let businessInfo;
    export let customerBooking;
    export let submitCallback = undefined;

    export let customerBookingInformationProps;

    // Get the availability from the server
    let walkinAvailabilityFlag = false;

    let preselectForWalkIn = isToday(customerBooking.bookingDate) ||
        customerBooking.bookingState === CustomerBookingState.SERVICING;

    let currentTimeString = "00:00";
    let availableTimeOptionList = [];

    async function fetchAvailableTimeList() {
        // Empty
        availableTimeOptionList = [];

        const bookingDate = dayjs(customerBooking.bookingDate, formatToDate);
        currentTimeString = "00:00"; // Booking date is in the future
        if (bookingDate.isSame($now, 'day')) {
            currentTimeString = $now.format(formatToTime)
        }
            // Invalid, the date selected is before today
        // Set it to the end of the day for no availability
        else if (bookingDate.isBefore($now, 'day')) {
            currentTimeString = "23:59";
        }

        try {
            let response = {};
            const clonedCustomerBooking = {
                ...customerBooking
            };

            if (walkinAvailabilityFlag) {
                clonedCustomerBooking.bookingState = CustomerBookingState.APPOINTMENT;

                // Get the availabilities
                response = await availability(
                    businessInfo.businessID,
                    clonedCustomerBooking.bookingDate,
                    currentTimeString,
                    clonedCustomerBooking,
                    5
                );

                // Initialize the available time
                availableTimeOptionList = response.availabilityList.map(
                    availability => {
                        return {
                            value: availability.timePeriod.startTime,
                            name: `${dayjs(availability.timePeriod.startTime, formatToTime).format(formatToTimeAM)} to ${dayjs(availability.timePeriod.endTime, formatToTime).format(formatToTimeAM)} (~${availability.duration} minutes)`,
                            availability: availability
                        };
                    });
            } else {
                clonedCustomerBooking.bookingState = CustomerBookingState.SCHEDULE;

                // Get the availabilities
                response = await availability(
                    businessInfo.businessID,
                    clonedCustomerBooking.bookingDate,
                    currentTimeString,
                    clonedCustomerBooking,
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

            // Currently the availability is not walk-in
            if (!walkinAvailabilityFlag) {
                // Add the option to fetch walk-in availability
                if (availableTimeOptionList.length > 0) {
                    availableTimeOptionList.push({
                        value: undefined,
                        name: "Show more availability...",
                        availability: undefined
                    });
                }
                    // No availability
                // Search for walk-in availability
                else if (availableTimeOptionList.length === 0) {
                    walkinAvailabilityFlag = true;
                    await fetchAvailableTimeList();
                }
            }

            //console.log("availableTimeOptionList", availableTimeOptionList)
        } catch (error) {
            console.log(error);
            availableTimeOptionList = [];
        }

        if (!customerBookingInformationProps.overrideFlag)
        {
            // Preselect booking time
            // Select the first option
            if (preselectForWalkIn && availableTimeOptionList.length > 0) {
                customerBooking.bookingTime = availableTimeOptionList[0].value;
            }
                // Customer booking already have a select booking time
                // Preselect that time
                // This could be from edit customer booking
            // If the selected booking time no longer available, unselected it by setting it to null
            else if (customerBooking.bookingTime) {
                customerBooking.bookingTime =
                    availableTimeOptionList.find(option => option.value === customerBooking.bookingTime)?.value ?? null;
            }
            // Default and safeguard, no booking time selected
            else {
                customerBooking.bookingTime = null;
            }
        }
    }

    // Show more availability is selected
    // Fetch the walk-in availability
    let selectedAvailability = undefined;
    $: selectedAvailability = availableTimeOptionList.find(option => option.value === customerBooking.bookingTime)?.availability;
    $: if (customerBooking.bookingTime === undefined) {
        // Reset the selected booking time
        customerBooking.bookingTime = null;

        // Fetch walk-in availability
        walkinAvailabilityFlag = true;
        fetchAvailableTimeList();
    }

    let dateSelected = customerBooking.bookingDate;

    function getAvailableTimeOptionList() {
        // New date selected
        customerBooking.bookingDate = dateSelected;

        // Reset the selected booking time and walk-in flag
        selectedAvailability = undefined;
        walkinAvailabilityFlag = false;

        // Search for walk-in if trying to book today
        // Or booking state is servicing
        preselectForWalkIn = isToday(customerBooking.bookingDate) ||
            customerBooking.bookingState === CustomerBookingState.SERVICING;
        if (preselectForWalkIn) {
            walkinAvailabilityFlag = true;
        }
        // Reset the booking time
        else {
            customerBooking.bookingTime = null;
        }

        //console.log(`Date selected ${dateSelected} walk-in ${walkinAvailabilityFlag}`);

        // Get the new available time
        fetchAvailableTimeList();
    }

    // Initial fetch for availability
    onMount(async () => {
        getAvailableTimeOptionList();
    })

    // Reactive statement to fetch times when the date changes
    $: if (dateSelected !== customerBooking.bookingDate) {
        getAvailableTimeOptionList();
    }

    function customerExists() {
        if (customerBookingInformationFormProps.customerNameAutoComplete) {
            getCustomer(customerBooking.customer.phoneNumber)
                .then(customer => {
                    if (customer && customer.customerName) {
                        customerBooking.customer.customerName = customer.customerName;

                        console.log(`Autofilled customer name ${customer.customerName}`);
                    }
                })
                .catch(error => {
                    console.error('Failed to get customer:', error);
                });
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

    async function submit() {
        console.log("submit()", customerBooking);

        let success = false;
        let error = false;

        try {
            let response = {};

            // Initialize customer booking
            // Keep the current booking state if it is not in schedule state
            // The backend will handle walk-in flag on creating the customer booking
            customerBooking.bookingState = (!customerBooking.bookingState || customerBooking.bookingState === CustomerBookingState.SCHEDULE)
                ? CustomerBookingState.APPOINTMENT
                : customerBooking.bookingState;
            customerBooking.walkIn = false;

            // Force submit if override is toggled
            if (customerBookingInformationProps.overrideFlag) {
                response = await forceSubmitBooking(
                    businessInfo.businessID,
                    currentTimeString,
                    customerBooking
                );
            }
            // Submit appointment
            else {
                // Asynchronous servicing
                if (walkinAvailabilityFlag) {
                    customerBooking.walkIn = true;
                }

                response = await submitBooking(
                    businessInfo.businessID,
                    currentTimeString,
                    selectedAvailability.timePeriod,
                    customerBooking
                );
            }

            // Success
            if (response.submitted) {
                success = true;

                // Send SMS
                if (customerBookingInformationProps.sendSmsFlag) {
                    // Send SMS confirmation for the appointment
                    sendSmsConfirmBookingSuccess(businessInfo.businessName, response.customerBooking)
                        .then(() => {
                            console.log('Sent SMS appointment confirmation.');
                            response.customerBooking.smsConfirmationSent = true;

                            // Save to the database
                            initializeCustomerBooking(response.customerBooking)
                                .then(() => {
                                    console.log('Save appointment confirmation.');
                                })
                                .catch(error => {
                                    console.error('Failed to save appointment confirmation:', error);
                                });
                        })
                        .catch(error => {
                            console.error('Failed to send appointment confirmation:', error);
                        });

                    // Schedule SMS for reminder for the appointment
                    sendSmsBookingReminder(businessInfo.businessName, response.customerBooking)
                        .then((scheduledReminderResponse) => {
                            console.log('Scheduled SMS appointment reminder.', scheduledReminderResponse);

                            // Record the SMS sid to the database
                            response.customerBooking.smsAppointmentReminderSid = scheduledReminderResponse.sid;
                            initializeCustomerBooking(response.customerBooking);
                        })
                        .catch(error => {
                            console.error('Error sending SMS appointment confirmation:', error);
                        });
                }

                // Move the customer booking to lobby
                if (customerBookingInformationProps.lobbyBookingStateFlag) {
                    moveToLobby($now, response.customerBooking, initializeCustomerBooking);
                }
            }
        } catch (err) {
            error = true;
            console.error("Error submitting booking:", err);
        }

        // Call the callback function for submit
        if (submitCallback) {
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
        {#if customerBookingInformationProps.overrideFlag}
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

    {#if customerBookingInformationFormProps.requiredAgreeToReceiveSms}
        <Label class="space-y-2">
            <input type="checkbox"
                   bind:checked={isConsentChecked}
                   required
                   id="smsConsentCheckbox"/>
            <span> I agree to receive SMS messages about my appointment.</span>
        </Label>
    {/if}

    <Button type="submit" class="w-full">
        Submit
    </Button>
</form>
