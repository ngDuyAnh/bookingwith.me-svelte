<script>
    import {business} from "$lib/page/stores/business/business.js";
    import {Button, Tooltip} from "flowbite-svelte";
    import {sendSmsAppointment, sendSMSAskingForReview, sendSmsLobby} from "$lib/api/api_twilio/functions.js";
    import {
        moveToCompleted,
        moveToLobby,
        moveToServicing
    } from "$lib/components/Modal/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {checkAbleToSendReviewReminder} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {checkAbleToSendSmsReviewReminder} from "$lib/api/api_server/functions.js";
    import {
        deleteCustomerBooking,
        initializeCustomerBooking
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {
        bookingList,
        fetchAppointmentCustomerBookingList
    } from "$lib/page/protected/business-portal/page_lobby/page/BookingList/stores/bookingList.js";
    import {
        handleEditCustomerBookingLobbyModal
    } from "$lib/components/Modal/CustomerBookingLobbyModal/stores/customerBookingLobbyModal.js";

    export let customerBooking;

    export let indicateSendToCompleted = false;

    // Check if sms review reminder can be sent
    // Only check if the customer booking is completed and review reminder not yet sent
    let ableToSendSmsReviewReminder = false;
    let sendingReviewReminder = false;
    $: if (customerBooking &&
        customerBooking.bookingState === CustomerBookingState.COMPLETED &&
        !customerBooking.smsReviewReminderSent) {

            ableToSendSmsReviewReminder = false;

            checkAbleToSendReviewReminder(customerBooking)
                .then(response => {
                    ableToSendSmsReviewReminder = checkAbleToSendSmsReviewReminder(response);
                    //console.log(`customerBooking.smsReviewReminderSent ${customerBooking.smsReviewReminderSent} ableToSendSmsReviewReminder ${ableToSendSmsReviewReminder}, allowToSendReviewReminderSMS ${allowToSendReviewReminderSMS}, moreThan6Months ${moreThan6Months}`)
                })
                .catch(error => {
                    console.error('Failed at checkAbleToSendReviewReminder():', error);
                });
    }
    else {
        ableToSendSmsReviewReminder = false;
    }



    // Send appointment reminder
    let sendingAppointmentReminder = false;
    async function handleSendSmsAppointment() {
        if (!customerBooking.smsAppointmentSent) {

            sendingAppointmentReminder = true;

            sendSmsAppointment($business.businessInfo.businessName, customerBooking)
                .then(() => {
                    console.log('Sent SMS appointment ready soon reminder.');

                    // Record appointment SMS to the database
                    customerBooking.smsAppointmentSent = true;
                    initializeCustomerBooking(customerBooking);
                })
                .catch(error => {
                    sendingAppointmentReminder = false;
                    console.error('Failed to send SMS appointment ready soon reminder:', error);
                });
        }
    }

    let sendingLobbyReminder = false;
    async function handleSendSmsLobby() {
        if (!customerBooking.smsAppointmentSent) {

            sendingLobbyReminder = true;

            sendSmsLobby($business.businessInfo.businessName, customerBooking)
                .then(() => {
                    console.log('Sent SMS appointment ready soon reminder.');

                    // Record appointment SMS to the database
                    customerBooking.smsLobbySent = true;
                    initializeCustomerBooking(customerBooking);
                })
                .catch(error => {
                    sendingLobbyReminder = false;
                    console.error('Failed to send SMS lobby ready reminder:', error);
                });
        }
    }

    async function handleReviewSend() {
        if (ableToSendSmsReviewReminder && !customerBooking.smsReviewReminderSent) {

            sendingReviewReminder = true;

            sendSMSAskingForReview($business.businessInfo.businessName, customerBooking)
                .then(() => {
                    console.log('Review reminder sent.');

                    // Record appointment SMS to the database
                    customerBooking.smsReviewReminderSent = true;
                    initializeCustomerBooking(customerBooking);
                })
                .catch(error => {
                    sendingReviewReminder = false;
                    console.error('Error sending review reminder:', error);
                });
        }
    }

    async function handleCompleteClick() {
        if (confirm("Are you sure you want to mark this as complete?")) {
            await moveToCompleted(customerBooking);
        }
    }

    function handleDeleteClick() {
        if (confirm("Are you sure you want to delete this appointment?")) {
            deleteCustomerBooking($business.businessInfo.businessID, customerBooking)
                .then(() => {
                    console.log("Deleted customer booking.");

                    // Re-fetch the customer booking list
                    fetchAppointmentCustomerBookingList($business.businessInfo.businessID, $bookingList.date);
                })
                .catch(error => {
                    console.error('Error deleting customer booking:', error);
                });
        }
    }

    async function handleNoShowClick() {
        if (confirm("Are you sure you want to mark this as no show?")) {
            customerBooking.noShow = true;
            await moveToCompleted(customerBooking);
        }
    }
</script>

<div class="flex justify-between">

    <!--Left options-->
    <div>
        <!--Edit booking or ask for review-->
        {#if customerBooking.bookingState !== CustomerBookingState.COMPLETED}
            <Button
                    color="light"
                    outline
                    on:click={() => handleEditCustomerBookingLobbyModal(customerBooking)}
            >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                </svg>
            </Button>
            <Tooltip>Edit booking</Tooltip>

        {:else}
            <Button disabled={sendingReviewReminder || !ableToSendSmsReviewReminder || customerBooking.smsReviewReminderSent || customerBooking.noShow}
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
            <Button disabled={sendingAppointmentReminder || customerBooking.smsAppointmentSent}
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
        {:else if customerBooking.bookingState === CustomerBookingState.LOBBY}
            <!--Send SMS lobby ready-->
            <Button disabled={sendingLobbyReminder || customerBooking.smsLobbySent}
                    id="show-tooltip"
                    color="light" outline
                    on:click={handleSendSmsLobby}
            >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                     viewBox="0 0 24 24">
                    <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z"/>
                </svg>
            </Button>
            {#if !customerBooking.smsAppointmentSent}
                <Tooltip>Send SMS ready</Tooltip>
            {:else}
                <Tooltip>Reminder already sent</Tooltip>
            {/if}
        {/if}
    </div>

    <!--Right options-->
    <div class="content-center space-x-2">
        <span class="text-gray-700 font-bold">Move to:</span>

        <!--Move to lobby-->
        {#if customerBooking.bookingState < CustomerBookingState.LOBBY}
            <Button class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    on:click={() => moveToLobby(customerBooking)}>Lobby
            </Button>
        {/if}

        <!--Move to servicing-->
        {#if customerBooking.bookingState !== CustomerBookingState.SERVICING}
            <Button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    on:click={() => moveToServicing(customerBooking)}>Servicing
            </Button>
        {/if}

        <!--Cancel the appointment-->
        {#if customerBooking.bookingState === CustomerBookingState.APPOINTMENT}
            <Button disabled={customerBooking.deleted}
                    class="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    on:click={handleDeleteClick}>Delete
            </Button>
        {/if}

        <!--No show or send customer booking to completed-->
        {#if customerBooking.bookingState === CustomerBookingState.APPOINTMENT ||
                customerBooking.bookingState === CustomerBookingState.COMPLETED}
            <Button disabled={customerBooking.noShow}
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    on:click={handleNoShowClick}>No show
            </Button>
            {#if customerBooking.noShow}
            <Tooltip placement="top-end">Move to servicing to undo</Tooltip>
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
