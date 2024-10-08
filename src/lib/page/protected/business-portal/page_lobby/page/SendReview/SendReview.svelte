<script>
    import {Alert, Button, DeviceMockup, Input, Label, Toggle, Tooltip} from "flowbite-svelte";
    import {
        Customer,
        CustomerBooking,
        CustomerBookingChannel,
        CustomerBookingState
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        forceSubmitBooking,
        initializeCustomerBooking
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {formatPhoneNumber, rawPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {checkAbleToSendReviewReminderPhoneNumber} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {checkAbleToSendSmsReviewReminder} from "$lib/api/api_server/functions.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {sendSMSAskingForReview, sendSMSAskingForReviewNow} from "$lib/api/api_twilio/functions.js";
    import {nowTime} from "$lib/page/stores/business/business.js";
    import {fly} from "svelte/transition";
    import {InfoCircleSolid} from "flowbite-svelte-icons";

    let completedPhoneNumber = false;
    let phoneNumber = "";
    let formattedPhoneNumber = "";
    let ableToSendSmsReviewReminder = false;
    let overrideForceSend = false;

    let alertMsg = "";

    function handleBusinessPhoneNumberInput(event) {
        alertMsg= "";
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

                    // console.log(`ableToSendSmsReviewReminder ${ableToSendSmsReviewReminder}`);
                    if (!ableToSendSmsReviewReminder) {
                        alertMsg = `Review reminder already sent to this number.`;
                    }
                })
                .catch(error => {
                    alertMsg = `Something went wrong, try again.`;
                    console.error('Failed at checkAbleToSendReviewReminder():', error);
                });
        } else {
            completedPhoneNumber = false;
        }
    }

    let sendTimeOption = 'now'; // Default to sending now

    async function send() {
        // Ensure able to send sms asking for review
        if (ableToSendSmsReviewReminder || overrideForceSend)
        {
            // Send the message
            overrideForceSend = false;
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

                // Reset the form
                alertMsg = "";
                phoneNumber = "";
                formattedPhoneNumber = "";

                // Submit the filler customer booking to be used to send review reminder
                let response = await forceSubmitBooking(
                    $business.businessInfo.businessID,
                    "00:00",
                    customerBooking
                );

                // Send the SMS
                if (response.submitted) {

                    // Send now
                    if (sendTimeOption === 'now')
                    {
                        await sendSMSAskingForReviewNow($business.businessInfo.businessName, response.customerBooking);
                    }
                    else
                    {
                        await sendSMSAskingForReview($business.businessInfo.businessName, response.customerBooking);
                    }

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

    $: console.log("ableToSendSmsReviewReminder",ableToSendSmsReviewReminder);
</script>

<div class="my-auto justify-center">
    <DeviceMockup >
        <form on:submit|preventDefault={send} class="flex flex-col justify-center h-full space-y-4 p-3">

            <div class="flex items-center">
                <Toggle bind:checked={overrideForceSend}>Override send
                </Toggle>
                <Tooltip>Force send the review</Tooltip>
            </div>

            <Label class="space-y-2">
                <div class="flex items-center">
                    <span>Send Time:</span>
                    <select bind:value={sendTimeOption} class="form-select block w-full mt-1 rounded-lg">
                        <option value="now">Now</option>
                        <option value="later">In 15 Minutes</option>
                    </select>
                </div>
            </Label>

            <Label class="space-y-2">
                <span>Phone Number:</span>
                <Alert class="{alertMsg !== '' ?'':'hidden'} bg-none mb-4" params={{ x: 200 }} transition={fly}>
                    <InfoCircleSolid class="w-5 h-5 ripple" slot="icon"/>
                    <span>{alertMsg}</span>
                </Alert>
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
            ${completedPhoneNumber && (ableToSendSmsReviewReminder || overrideForceSend) ? "" : "cursor-not-allowed opacity-50"}`}
                    disabled={!completedPhoneNumber || (!ableToSendSmsReviewReminder && !overrideForceSend)}
                    type="submit"
            >
                Send
            </Button>
        </form>

    </DeviceMockup>

</div>


