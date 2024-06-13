<script>
    import dayjs from "dayjs";
    import {formatToDate, formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {
        customerBookingClickModal
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {
        moveToServicing
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getContext} from "svelte";
    import {Button, Tooltip} from "flowbite-svelte";
    import {sendSMSAskingForReview} from "$lib/api/api_twilio/functions.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {checkAbleToSendReviewReminder} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {checkAbleToSendSmsReviewReminder} from "$lib/api/api_server/functions.js";

    let customerBooking = undefined;
    let ableToSendSmsReviewReminder = false;

    $: {
        // Change customer booking
        customerBooking = $customerBookingClickModal.customerBooking;

        // Check if sms review reminder can be sent
        if (customerBooking)
        {
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
    }

    // Retrieve customer booking list update function
    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleServicingClick()
    {
        moveToServicing($now, customerBooking, submitCustomerBooking);
    }

    async function handleReviewSend()
    {
        if(ableToSendSmsReviewReminder && !customerBooking.smsReviewReminderSent)
        {
            sendSMSAskingForReview($business.businessInfo.businessName, customerBooking);
            submitCustomerBooking(customerBooking);
        }
    }
</script>

<div>
    <p><strong>Customer name:</strong> {customerBooking.customer.customerName}</p>
    <p><strong>Phone number:</strong> {customerBooking.customer.phoneNumber}</p>
    <p><strong>Booking time:</strong> {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}</p>
    <p><strong>Check-in time:</strong> {dayjs(customerBooking.checkinTime, formatToTime).format(formatToTimeAm)}</p>
    <p><strong>Start time:</strong> {dayjs(customerBooking.servicingStartTime, formatToTime).format(formatToTimeAm)}</p>
    <p><strong>End time:</strong> {dayjs(customerBooking.servicingEndTime, formatToTime).format(formatToTimeAm)}</p>
    {#if customerBooking.message.length !== 0}
        <p class="break-words">
            <strong>Message:</strong> {customerBooking.message}
        </p>
    {/if}

    <div class="mt-4">
        <div class="font-bold">Guest(s):</div>
        {#each customerBooking.customerIndividualBookingList as individualBooking}
            <div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
                {#each individualBooking.customerIndividualServiceBookingList as serviceBooking}
                    <div class="mt-1 p-1">
                        <p>{serviceBooking.service.serviceName}
                            ({serviceBooking.employee?.employeeName || 'Any'})</p>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<div class="mt-4 flex ">
    <div class="justify-start">
        <Button disabled={!ableToSendSmsReviewReminder || customerBooking.smsReviewReminderSent} id="show-tooltip" on:click={() => handleReviewSend()} color="light" outline>
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.209 3.816a1 1 0 0 0-1.966.368l.325 1.74a5.338 5.338 0 0 0-2.8 5.762l.276 1.473.055.296c.258 1.374-.228 2.262-.63 2.998-.285.52-.527.964-.437 1.449.11.586.22 1.173.75 1.074l12.7-2.377c.528-.1.418-.685.308-1.27-.103-.564-.636-1.123-1.195-1.711-.606-.636-1.243-1.306-1.404-2.051-.233-1.085-.275-1.387-.303-1.587-.009-.063-.016-.117-.028-.182a5.338 5.338 0 0 0-5.353-4.39l-.298-1.592Z"/>
                <path fill-rule="evenodd" d="M6.539 4.278a1 1 0 0 1 .07 1.412c-1.115 1.23-1.705 2.605-1.83 4.26a1 1 0 0 1-1.995-.15c.16-2.099.929-3.893 2.342-5.453a1 1 0 0 1 1.413-.069Z" clip-rule="evenodd"/>
                <path d="M8.95 19.7c.7.8 1.7 1.3 2.8 1.3 1.6 0 2.9-1.1 3.3-2.5l-6.1 1.2Z"/>
            </svg>
        </Button>
        {#if ableToSendSmsReviewReminder && !customerBooking.smsReviewReminderSent}
            <Tooltip triggeredBy="#show-tooltip">Send a review reminder to customer</Tooltip>
        {:else}
            <Tooltip triggeredBy="#show-tooltip">Review reminder already sent</Tooltip>
        {/if}
    </div>

    <div class="ml-auto justify-end items-center space-x-2">
        <span class="text-gray-700 font-bold">Move to:</span>
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleServicingClick}>Servicing
        </button>
    </div>
</div>
