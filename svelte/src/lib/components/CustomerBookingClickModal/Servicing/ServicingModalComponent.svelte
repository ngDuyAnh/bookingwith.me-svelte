<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Button, Tooltip} from "flowbite-svelte";
    import {
        customerBookingClickModal
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {
        moveToCompleted
    } from "$lib/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getContext} from "svelte";
    import CustomerIndividualBookingComponent
        from "$lib/components/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualBookingComponent.svelte";
    import {handleLobbyPortalEditCustomerBooking} from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {checkAbleToSendReviewReminder} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {checkAbleToSendSmsReviewReminder} from "$lib/api/api_server/functions.js";
    import {sendSMSAskingForReview} from "$lib/api/api_twilio/functions.js";

    let ableToSendSmsReviewReminder = false;

    $: {
        // Check if sms review reminder can be sent
        if ($customerBookingClickModal.customerBooking) {
            ableToSendSmsReviewReminder = false;
            checkAbleToSendReviewReminder($customerBookingClickModal.customerBooking)
                .then(response => {
                    ableToSendSmsReviewReminder = checkAbleToSendSmsReviewReminder(response);

                    //console.log(`$customerBookingClickModal.$customerBookingClickModal.customerBooking.smsReviewReminderSent ${$customerBookingClickModal.$customerBookingClickModal.customerBooking.smsReviewReminderSent} ableToSendSmsReviewReminder ${ableToSendSmsReviewReminder}, allowToSendReviewReminderSMS ${allowToSendReviewReminderSMS}, moreThan6Months ${moreThan6Months}`)
                })
                .catch(error => {
                    console.error('Failed at checkAbleToSendReviewReminder():', error);
                });
        }
    }

    async function handleReviewSend() {
        if (ableToSendSmsReviewReminder && !$customerBookingClickModal.$customerBookingClickModal.customerBooking.smsReviewReminderSent) {
            sendSMSAskingForReview($business.businessInfo.businessName, $customerBookingClickModal.customerBooking);
            submitCustomerBooking($customerBookingClickModal.customerBooking);
        }
    }

    // Retrieve customer booking list update function
    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleCompleteClick() {
        console.log('Moving to completed:', $customerBookingClickModal.customerBooking);

        await moveToCompleted($now, $customerBookingClickModal.customerBooking, submitCustomerBooking);
    }
</script>

<div>
    <p><strong>Customer name:</strong> {$customerBookingClickModal.customerBooking.customer.customerName}</p>
    <p><strong>Phone number:</strong> {$customerBookingClickModal.customerBooking.customer.phoneNumber}</p>
    <p><strong>Booking
        time:</strong> {dayjs($customerBookingClickModal.customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}
    </p>
    <p><strong>Check-in
        time:</strong> {dayjs($customerBookingClickModal.customerBooking.checkinTime, formatToTime).format(formatToTimeAm)}
    </p>
    <p><strong>Start
        time:</strong> {dayjs($customerBookingClickModal.customerBooking.servicingStartTime, formatToTime).format(formatToTimeAm)}
    </p>
    {#if $customerBookingClickModal.customerBooking.message.length !== 0}
        <p class="break-words">
            <strong>Message:</strong> {$customerBookingClickModal.customerBooking.message}
        </p>
    {/if}

    <div class="mt-4">
        <div class="font-bold">Guest(s):</div>
        {#each $customerBookingClickModal.customerBooking.customerIndividualBookingList as individualBooking (individualBooking.individualID)}
            <CustomerIndividualBookingComponent
                    customerBooking={$customerBookingClickModal.customerBooking}
                    {individualBooking}
            />
        {/each}
    </div>
</div>

<div class="mt-4 flex">

    <!--Left options-->
    <div class="justify-start">
        <Button id="show-tooltip" on:click={() => handleLobbyPortalEditCustomerBooking($customerBookingClickModal.customerBooking)}
                color="light" outline>
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
            </svg>
        </Button>
        <Tooltip>Edit booking</Tooltip>
    </div>

    <!--Right options-->
    <div class="ml-auto justify-end items-center space-x-2">
        <span class="text-gray-700 font-bold">Move to:</span>

        <Button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleCompleteClick}>Complete
        </Button>
    </div>
</div>
