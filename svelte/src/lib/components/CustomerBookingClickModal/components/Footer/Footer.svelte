<script>
    import {
        handleLobbyPortalEditCustomerBooking
    } from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {Button, Tooltip} from "flowbite-svelte";
    import {sendSmsAppointment, sendSMSAskingForReview} from "$lib/api/api_twilio/functions.js";
    import {
        moveToCompleted,
        moveToLobby,
        moveToServicing
    } from "$lib/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {checkAbleToSendReviewReminder} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {checkAbleToSendSmsReviewReminder} from "$lib/api/api_server/functions.js";
    import {initializeCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";

    export let customerBooking;

    export let indicateSendToCompleted = false;

    let ableToSendSmsReviewReminder = false;
    let sendingAppointmentReminder = false;
    let sendingReviewReminder = false;

    $: {
        // Check if sms review reminder can be sent
        if (customerBooking) {

            ableToSendSmsReviewReminder = false;
            checkAbleToSendReviewReminder(customerBooking)
                .then(response => {
                    ableToSendSmsReviewReminder = checkAbleToSendSmsReviewReminder(response);
                    //console.log(`customerBooking.smsReviewReminderSent ${customerBooking.smsReviewReminderSent} ableToSendSmsReviewReminder ${ableToSendSmsReviewReminder}, allowToSendReviewReminderSMS ${allowToSendReviewReminderSMS}, moreThan6Months ${moreThan6Months}`)
                })
                .catch(error => {
                    sendingReviewReminder=false;
                    console.error('Failed at checkAbleToSendReviewReminder():', error);
                });
        }
    }


    async function handleSendSmsAppointment() {
        sendingAppointmentReminder = true;
        if (!customerBooking.smsAppointmentSent) {
            sendSmsAppointment($business.businessInfo.businessName, customerBooking)
                .then(() => {
                    console.log('Sent SMS appointment ready soon reminder.');

                    // Record appointment SMS to the database
                    customerBooking.smsAppointmentSent = true;
                    initializeCustomerBooking(customerBooking);
                })
                .catch(error => {
                    console.error('Failed to send SMS appointment ready soon reminder:', error);
                });
            sendingAppointmentReminder = false;
        }
    }

    async function handleReviewSend() {
        if (ableToSendSmsReviewReminder &&
            !customerBooking.smsReviewReminderSent) {
            sendingReviewReminder=true;

            sendSMSAskingForReview($business.businessInfo.businessName, customerBooking)
                .then(() => {
                    console.log('Review reminder sent.');

                    // Record appointment SMS to the database
                    customerBooking.smsReviewReminderSent = true;
                    initializeCustomerBooking(customerBooking);
                })
                .catch(error => {
                    sendingReviewReminder=false;
                    console.error('Error sending review reminder:', error);
                });


        }
    }

    async function handleLobbyClick() {
        moveToLobby(customerBooking);
    }

    async function handleServicingClick() {
        customerBooking.noShow = false;
        moveToServicing(customerBooking);
    }

    function handleCompleteClick() {
        if (confirm("Are you sure you want to mark this as complete?")) {
            moveToCompleted(customerBooking);
        }
    }

    async function handleNoShowClick() {
        if (confirm("Are you sure you want to mark this as no show?")) {
            customerBooking.noShow = true;
            moveToCompleted(customerBooking);
        }
    }
</script>

<div class="flex justify-between">

    <!--Left options-->
    <div>
        <!--Edit booking-->
        {#if customerBooking.bookingState !== CustomerBookingState.COMPLETED}
            <Button
                    color="light"
                    outline
                    on:click={() => handleLobbyPortalEditCustomerBooking(customerBooking)}
            >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                </svg>
            </Button>
            <Tooltip>Edit booking</Tooltip>

        {:else}
            <!--Asking for review-->
            <Button disabled={sendingReviewReminder|| !ableToSendSmsReviewReminder || customerBooking.smsReviewReminderSent || customerBooking.noShow}
                    color="light"
                    outline
                    on:click={handleReviewSend}
            >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                     width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.209 3.816a1 1 0 0 0-1.966.368l.325 1.74a5.338 5.338 0 0 0-2.8 5.762l.276 1.473.055.296c.258 1.374-.228 2.262-.63 2.998-.285.52-.527.964-.437 1.449.11.586.22 1.173.75 1.074l12.7-2.377c.528-.1.418-.685.308-1.27-.103-.564-.636-1.123-1.195-1.711-.606-.636-1.243-1.306-1.404-2.051-.233-1.085-.275-1.387-.303-1.587-.009-.063-.016-.117-.028-.182a5.338 5.338 0 0 0-5.353-4.39l-.298-1.592Z"/>
                    <path fill-rule="evenodd"
                          d="M6.539 4.278a1 1 0 0 1 .07 1.412c-1.115 1.23-1.705 2.605-1.83 4.26a1 1 0 0 1-1.995-.15c.16-2.099.929-3.893 2.342-5.453a1 1 0 0 1 1.413-.069Z"
                          clip-rule="evenodd"/>
                    <path d="M8.95 19.7c.7.8 1.7 1.3 2.8 1.3 1.6 0 2.9-1.1 3.3-2.5l-6.1 1.2Z"/>
                </svg>
            </Button>
            {#if ableToSendSmsReviewReminder && !customerBooking.smsReviewReminderSent}
                <Tooltip>Send a review reminder to customer</Tooltip>
            {:else}
                <Tooltip>Review reminder already sent</Tooltip>
            {/if}
        {/if}

        <!--Send SMS appointment reminder-->
        {#if customerBooking.bookingState === CustomerBookingState.APPOINTMENT}
            <Button disabled={customerBooking.smsAppointmentSent || sendingAppointmentReminder}
                    id="show-tooltip"
                    color="light" outline
                    on:click={handleSendSmsAppointment}
            >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                     viewBox="0 0 24 24">
                    <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z"/>
                </svg>
            </Button>
            {#if !customerBooking.smsAppointmentSent}
                <Tooltip>Send SMS ready soon</Tooltip>
            {:else}
                <Tooltip>Reminder already sent</Tooltip>
            {/if}
        {/if}
    </div>

    <!--Right options-->
    <div class="content-center space-x-2">
        <span class="text-gray-700 font-bold">Move to:</span>

        {#if customerBooking.bookingState < CustomerBookingState.LOBBY}
            <Button class="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    on:click={handleLobbyClick}>Lobby
            </Button>
        {/if}

        {#if customerBooking.bookingState !== CustomerBookingState.SERVICING}
            <Button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    on:click={handleServicingClick}>Servicing
            </Button>
        {/if}

        {#if customerBooking.bookingState === CustomerBookingState.APPOINTMENT ||
        customerBooking.bookingState === CustomerBookingState.COMPLETED}
            <Button disabled={customerBooking.noShow}
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    on:click={handleNoShowClick}>No show
            </Button>
            {#if customerBooking.noShow}
                <Tooltip>Move to servicing to undo</Tooltip>
            {/if}
        {:else}
            {#if indicateSendToCompleted}
                <Button class="animate-pulse bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        on:click={handleCompleteClick}>Complete
                </Button>
            {:else}
                <Button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        on:click={handleCompleteClick}>Complete
                </Button>
            {/if}
        {/if}
    </div>
</div>
