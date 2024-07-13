<script>
    import {Button, Input, Label} from "flowbite-svelte";
    import {
        CustomerBooking,
        CustomerBookingState,
        CustomerBookingChannel
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        forceSubmitBooking,
        initializeCustomerBooking
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {formatPhoneNumber, rawPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {
        checkAbleToSendReviewReminderPhoneNumber
    } from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {checkAbleToSendSmsReviewReminder} from "$lib/api/api_server/functions.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {sendSMSAskingForReview} from "$lib/api/api_twilio/functions.js";
    import {Customer} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {nowTime} from "$lib/page/stores/now/now_dayjs_store.js";

    let completedPhoneNumber = false;
    let phoneNumber = "";
    let formattedPhoneNumber = "";
    let ableToSendSmsReviewReminder = false;

    function handleBusinessPhoneNumberInput(event) {
        const input = event.target.value;

        // Update the raw customer phone number
        phoneNumber = rawPhoneNumber(input);

        // Format as "(123) 456-7890"
        formattedPhoneNumber = formatPhoneNumber(input);

        // When the formatted phone number is complete, check if able to send review reminder
        if (phoneNumber.length === 10) {
            completedPhoneNumber = true;

            ableToSendSmsReviewReminder = false;
            checkAbleToSendReviewReminderPhoneNumber($business.businessInfo.businessID, phoneNumber)
                .then(response => {
                    ableToSendSmsReviewReminder = checkAbleToSendSmsReviewReminder(response);

                    // console.log(`ableToSendSmsReviewReminder ${ableToSendSmsReviewReminder}`)
                })
                .catch(error => {
                    console.error('Failed at checkAbleToSendReviewReminder():', error);
                });
        } else {
            completedPhoneNumber = false;
        }
    }

    async function send() {
        // Ensure able to send sms asking for review
        if (ableToSendSmsReviewReminder) {
            // Sent
            ableToSendSmsReviewReminder = false;

            try {
                // Create the filler customer booking
                let customerBooking = {
                    ...CustomerBooking(),
                    customer: Customer(phoneNumber),

                    bookingChannel: CustomerBookingChannel.REVIEW,
                    bookingState: CustomerBookingState.COMPLETED,
                    bookingTime: nowTime()
                };

                // Submit the filler customer booking to be used to send review reminder
                let response = await forceSubmitBooking(
                    $business.businessInfo.businessID,
                    "00:00",
                    customerBooking
                );

                // Send the SMS
                if (response.submitted) {
                    await sendSMSAskingForReview($business.businessInfo.businessName, response.customerBooking);

                    // Record the sms sent to the database
                    response.customerBooking.smsReviewReminderSent = true;
                    await initializeCustomerBooking(response.customerBooking);
                }
            } catch (err) {
                console.error("Error sending sms review:", err);
                alert("Error sending SMS asking for review!");
            }
        }
    }
</script>

<form on:submit|preventDefault={send} class="space-y-4">
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

    <Button
            id="show-tooltip"
            class={`w-full py-2 px-4 rounded-lg text-white font-semibold
            ${completedPhoneNumber ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
            ${completedPhoneNumber && ableToSendSmsReviewReminder ? "" : "cursor-not-allowed opacity-50"}`}
            disabled={!completedPhoneNumber || !ableToSendSmsReviewReminder}
            type="submit"
    >
        Send
    </Button>
</form>
