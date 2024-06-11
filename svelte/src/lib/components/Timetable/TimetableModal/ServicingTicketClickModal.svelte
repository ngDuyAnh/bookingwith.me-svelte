<script>
    import {getContext, tick} from 'svelte';
    import dayjs from "dayjs";
    import {formatToDate, formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Button, Modal, Tooltip} from "flowbite-svelte";
    import CustomerIndividualServiceBookingComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualServiceBookingComponent/CustomerIndividualServiceBookingComponent.svelte";
    import {
        servicingTicketClickModal,
        servicingTicketClickModalToggleOpen
    } from "$lib/components/Timetable/TimetableModal/stores/servicingTicketClickModal.js";
    import {
        findPreselectEmployeeID,
        indicateToSendCustomerBookingToCompleted
    } from "$lib/components/Timetable/TimetableModal/functions.js";
    import {
        moveToCompleted
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {
        findIndividualBookingFromCustomerBooking
    } from "$lib/api/initialize_functions/customer-booking-utility-functions.js";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {handleEditCustomerBooking} from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {sendSMSAskingForReview} from "$lib/api/api_twilio/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {checkAbleToSendReviewReminder} from "$lib/api/api_server/lobby-portal/api.js";

    export let isToday;
    export let nonModal = false;

    let customerBooking = undefined;
    let individualBooking = undefined;
    let serviceBooking = undefined;

    let indicateSendToCompleted = false;
    let ableToSendSmsReviewReminder = false;

    $: {
        customerBooking = $servicingTicketClickModal.customerBooking;
        serviceBooking = $servicingTicketClickModal.serviceBooking;

        //console.log("serviceBooking", serviceBooking)

        // Get the individual booking from customer booking and service booking
        if (customerBooking && serviceBooking) {
            individualBooking = findIndividualBookingFromCustomerBooking(customerBooking, serviceBooking.individualID);
            indicateSendToCompleted = indicateToSendCustomerBookingToCompleted(customerBooking);

            checkAbleToSendReviewReminder(customerBooking)
                .then(response => {
                    const {allowToSendReviewReminderSMS, mostRecentDateReviewReminderSent} = response;

                    // Check if the most recent send date is more than 3 months ago
                    // The customer is new to the business
                    const moreThan3Months = mostRecentDateReviewReminderSent
                        ? dayjs().diff(dayjs(mostRecentDateReviewReminderSent, formatToDate), 'month') > 3
                        : true;

                    ableToSendSmsReviewReminder = allowToSendReviewReminderSMS && moreThan3Months;

                    //console.log(`ableToSendSmsReviewReminder ${ableToSendSmsReviewReminder}, allowToSendReviewReminderSMS ${allowToSendReviewReminderSMS}, moreThan3Months ${moreThan3Months}`)
                })
                .catch(error => {
                    console.error('Failed at checkAbleToSendReviewReminder():', error);
                });
        }
    }

    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleCompletedClick() {
        console.log("Moving to completed:", customerBooking);

        await moveToCompleted($now, customerBooking, submitCustomerBooking);
    }

    function hideParentOfFooter() {
        let footerDiv = document.querySelector('div[slot="footer"]');

        // try finding the div using the id
        if (!footerDiv) {
            footerDiv = document.getElementById('footer');
        }

        // apply 'display: none' to its parent
        if (footerDiv && footerDiv.parentElement) {
            footerDiv.parentElement.style.display = 'none';
        }
    }

    $: if ($servicingTicketClickModal.open) {
        // not sure about reliability but due to svelte basically abandoning fragment manipulation, forced to take shortcuts
        tick().then(() => {
            if (!isToday) {
                hideParentOfFooter();
            }
        });
    }

    async function handleReviewSend() {
        if (!customerBooking.smsReviewReminderSent) {
            sendSMSAskingForReview($business.businessInfo.businessName, customerBooking);

            customerBooking.smsReviewReminderSent = true;
            submitCustomerBooking(customerBooking);
        }
    }
</script>

<div class="absolute top-0 left-0 right-0">
    {#if customerBooking && individualBooking && serviceBooking}
        <Modal bind:open={$servicingTicketClickModal.open} size="md" outsideclose={!nonModal} dismissable={!nonModal}
               classBackdrop={nonModal? "hidden":""}
        >
            <p><strong>Customer name:</strong> {customerBooking.customer.customerName}</p>
            <p><strong>Booking time:</strong> {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}
            </p>
            <p><strong>Number of guest(s):</strong>{customerBooking.customerIndividualBookingList.length}</p>
            {#if customerBooking.message.length !== 0}
                <p class="break-words">
                    <strong>Message:</strong> {customerBooking.message}
                </p>
            {/if}

            <div class="mt-1">
                <div class="font-bold">Selected service:</div>

                {#if isToday && customerBooking.bookingState !== CustomerBookingState.COMPLETED}
                    <div class="border-2 border-green-400 rounded-md">
                        <CustomerIndividualServiceBookingComponent
                                {customerBooking}
                                {serviceBooking}
                                preselectEmployeeID={findPreselectEmployeeID($servicingTicketClickModal.employeeTimetableList, serviceBooking)}
                        />
                    </div>

                    <div class="mt-2">
                        {#if individualBooking.customerIndividualServiceBookingList.length > 1}
                            <div class="font-bold">Other services for this guest:</div>
                            {#each individualBooking.customerIndividualServiceBookingList as individualServiceBooking}
                                {#if serviceBooking.serviceBookingID !== individualServiceBooking.serviceBookingID}
                                    <CustomerIndividualServiceBookingComponent
                                            {customerBooking}
                                            serviceBooking={individualServiceBooking}
                                            preselectEmployeeID={findPreselectEmployeeID($servicingTicketClickModal.employeeTimetableList, individualServiceBooking)}
                                    />
                                {/if}
                            {/each}
                        {/if}
                    </div>

                    <div class="mt-6">
                        {#if customerBooking.customerIndividualBookingList.length > 1}
                            <div class="font-bold">Other related guest(s) for this booking:</div>
                            {#each customerBooking.customerIndividualBookingList as customerIndividualBooking (customerIndividualBooking.individualID)}
                                {#if customerIndividualBooking.individualID !== individualBooking.individualID }
                                    <div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
                                        {#each customerIndividualBooking.customerIndividualServiceBookingList as individualServiceBooking}
                                            <div class="mt-1 p-1">
                                                <CustomerIndividualServiceBookingComponent
                                                        {customerBooking}
                                                        serviceBooking={individualServiceBooking}
                                                        preselectEmployeeID={findPreselectEmployeeID($servicingTicketClickModal.employeeTimetableList, individualServiceBooking)}
                                                />
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            {/each}
                        {/if}
                    </div>

                {:else}
                    <p>{serviceBooking.service.serviceName}</p>
                {/if}
            </div>

            <!-- Footer only show if it is today -->
            <div id="footer" slot="footer" class="w-full {isToday ? '':'hidden'}">
                {#if customerBooking.bookingState !== CustomerBookingState.COMPLETED}
                    <div class="flex w-full">
                        <div class="justify-start">
                            <Button id="show-tooltip" color="light" outline
                                    on:click={() => {
                            servicingTicketClickModalToggleOpen();
                            handleEditCustomerBooking($servicingTicketClickModal.customerBooking)
                        }}
                            >
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                     viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2"
                                          d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                                </svg>
                            </Button>
                            <Tooltip triggeredBy="#show-tooltip">Edit Booking</Tooltip>
                        </div>

                        <div class="ml-auto justify-end space-x-2">
                            <span class="text-gray-700 font-bold">Move to:</span>
                            {#if indicateSendToCompleted}
                                <button
                                        class="animate-pulse bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        on:click={handleCompletedClick}>Complete
                                </button>
                            {:else}
                                <button
                                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        on:click={handleCompletedClick}>Complete
                                </button>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <div class="flex w-full">
                        <div class="justify-start">
                            <Button disabled={!ableToSendSmsReviewReminder || customerBooking.smsReviewReminderSent}
                                    id="show-tooltip" on:click={() => handleReviewSend()} color="light" outline>
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                     viewBox="0 0 24 24">
                                    <path d="M11.209 3.816a1 1 0 0 0-1.966.368l.325 1.74a5.338 5.338 0 0 0-2.8 5.762l.276 1.473.055.296c.258 1.374-.228 2.262-.63 2.998-.285.52-.527.964-.437 1.449.11.586.22 1.173.75 1.074l12.7-2.377c.528-.1.418-.685.308-1.27-.103-.564-.636-1.123-1.195-1.711-.606-.636-1.243-1.306-1.404-2.051-.233-1.085-.275-1.387-.303-1.587-.009-.063-.016-.117-.028-.182a5.338 5.338 0 0 0-5.353-4.39l-.298-1.592Z"/>
                                    <path fill-rule="evenodd"
                                          d="M6.539 4.278a1 1 0 0 1 .07 1.412c-1.115 1.23-1.705 2.605-1.83 4.26a1 1 0 0 1-1.995-.15c.16-2.099.929-3.893 2.342-5.453a1 1 0 0 1 1.413-.069Z"
                                          clip-rule="evenodd"/>
                                    <path d="M8.95 19.7c.7.8 1.7 1.3 2.8 1.3 1.6 0 2.9-1.1 3.3-2.5l-6.1 1.2Z"/>
                                </svg>
                            </Button>
                            {#if ableToSendSmsReviewReminder && !customerBooking.smsReviewReminderSent}
                                <Tooltip triggeredBy="#show-tooltip">Send a review reminder to customer</Tooltip>
                            {:else}
                                <Tooltip triggeredBy="#show-tooltip">Review reminder already sent</Tooltip>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        </Modal>
    {/if}
</div>
