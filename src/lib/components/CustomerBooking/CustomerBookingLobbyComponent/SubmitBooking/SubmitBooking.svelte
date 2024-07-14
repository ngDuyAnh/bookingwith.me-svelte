<script>
    import {CashSolid, UsersGroupSolid} from "flowbite-svelte-icons";
    import {Button, Input, Label, Textarea} from "flowbite-svelte";
    import {formatPhoneNumber, rawPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        forceSubmitBooking,
        getCustomer, initializeCustomerBooking,
        submitBooking
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {isToday} from "$lib/page/stores/now/now_dayjs_store.js";
    import {
        moveToAppointment,
        moveToLobby
    } from "$lib/components/Modal/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {sendSmsBookingReminder, sendSmsConfirmBookingSuccess} from "$lib/api/api_twilio/functions.js";

    export let customerBooking;
    export let customerBookingInformationProps;

    // Phone number
    let formattedPhoneNumber = formatPhoneNumber(customerBooking.customer.phoneNumber);

    function handlePhoneNumberInput(event) {
        const input = event.target.value;

        // Update the raw customer phone number
        customerBooking.customer.phoneNumber = rawPhoneNumber(input);

        // Format as "(123) 456-7890"
        formattedPhoneNumber = formatPhoneNumber(input);

        // Fetch the customer profile
        // Only fetch it one time
        if (customerBooking.customer.phoneNumber.length === 10) {
            getCustomer($business.businessInfo.businessID, customerBooking.customer.phoneNumber)
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

                // Move the customer booking state
                if (isToday(customerBooking.bookingDate))
                {
                    if (customerBookingInformationProps.lobbyBookingStateFlag) {
                        moveToLobby(response.customerBooking);
                    }
                    else if (customerBookingInformationProps.appointmentBookingStateFlag) {
                        moveToAppointment(response.customerBooking);
                    }
                }

                // Send SMS
                if (customerBookingInformationProps.sendSmsFlag) {
                    // Send SMS confirmation for the appointment
                    sendSmsConfirmBookingSuccess(businessInfo.businessName, response.customerBooking)
                        .then(async () => {
                            console.log('Sent SMS appointment confirmation.');
                            response.customerBooking.smsConfirmationSent = true;

                            // Schedule SMS for reminder for the appointment
                            await sendSmsBookingReminder(businessInfo.businessName, response.customerBooking)
                                .then((scheduledReminderResponse) => {
                                    console.log('Scheduled SMS appointment reminder.', scheduledReminderResponse);

                                    // Record the SMS sid to the database
                                    response.customerBooking.smsAppointmentReminderSid = scheduledReminderResponse.sid;
                                })
                                .catch(error => {
                                    console.error('Error sending SMS appointment confirmation:', error);
                                });

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
                }
            }
            else
            {
                await fetchAvailableTimeList();
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
</script>

<form on:submit|preventDefault={submit} class="space-y-4 h-full">
    <Label class="space-y-2">
        <span class="flex flex-row"><UsersGroupSolid/> Guest(s):  {totalGuests}</span>
        <span class="flex flex-row"><CashSolid/> Total: ${totalServiceCost}</span>
    </Label>
    <Label class="space-y-2">
        <span>Phone Number:</span>
        <Input
                id="phoneNumber"
                type="tel"
                placeholder="(123) 456-7890"
                bind:value={formattedPhoneNumber}
                on:input={handlePhoneNumberInput}
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

    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->

    <!--The message attach to the customer booking-->
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