<script>
    import {getContext, tick} from 'svelte';
    import {Modal} from "flowbite-svelte";
    import {
        servicingTicketClickModal
    } from "$lib/components/Timetable/TimetableModal/stores/servicingTicketClickModal.js";
    import {indicateToSendCustomerBookingToCompleted} from "$lib/components/Timetable/TimetableModal/functions.js";
    import {
        moveToCompleted,
        moveToServicing
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {
        findIndividualBookingFromCustomerBooking
    } from "$lib/api/initialize_functions/customer-booking-utility-functions.js";
    import {sendSMSAskingForReview} from "$lib/api/api_twilio/functions.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {checkAbleToSendReviewReminder} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {checkAbleToSendSmsReviewReminder} from "$lib/api/api_server/functions.js";
    import TicketInformation from "$lib/components/TimeTable/TimetableModal/TicketInformation/TicketInformation.svelte";
    import FooterInformation from "$lib/components/TimeTable/TimetableModal/FooterInformation/FooterInformation.svelte";

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

            ableToSendSmsReviewReminder = false;
            checkAbleToSendReviewReminder(customerBooking)
                .then(response => {
                    ableToSendSmsReviewReminder = checkAbleToSendSmsReviewReminder(response);

                    //console.log(`ableToSendSmsReviewReminder ${ableToSendSmsReviewReminder}, allowToSendReviewReminderSMS ${allowToSendReviewReminderSMS}, moreThan3Months ${moreThan3Months}`)
                })
                .catch(error => {
                    console.error('Failed at checkAbleToSendReviewReminder():', error);
                });
        }
    }

    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleServicingClick() {
        console.log("Moving to servicing:", customerBooking);

        await moveToServicing($now, customerBooking, submitCustomerBooking);
    }

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
            submitCustomerBooking(customerBooking);
        }
    }
</script>

{#if customerBooking && individualBooking && serviceBooking}
    {#if !nonModal}
        <div class="absolute top-0 left-0 right-0">

            <Modal bind:open={$servicingTicketClickModal.open} size="md" outsideclose={!nonModal}
                   dismissable={!nonModal}
                   classBackdrop={nonModal? "hidden":""} class="lg:max-h-[80vh]" classDialog="{nonModal? 'z-[0]':''}"
            >
                <TicketInformation
                        bind:customerBooking={customerBooking}
                        bind:individualBooking={individualBooking}
                        bind:serviceBooking={serviceBooking}
                        bind:isToday={isToday}
                />

                <!-- Footer only show if it is today -->
                <div id="footer" slot="footer" class="w-full
                    {isToday ? '':'hidden'}">

                    <FooterInformation
                            bind:customerBooking={customerBooking}
                            bind:ableToSendSmsReviewReminder={ableToSendSmsReviewReminder}
                            handleReviewSend={handleReviewSend}
                            handleServicingClick={handleServicingClick}
                            handleCompletedClick={handleCompletedClick}
                    />
                </div>
            </Modal>
        </div>
    {:else}
        <div class="flex flex-col p-4 bg-gray-50 w-full h-full overflow-y-auto">
            <TicketInformation
                    bind:customerBooking={customerBooking}
                    bind:individualBooking={individualBooking}
                    bind:serviceBooking={serviceBooking}
                    bind:isToday={isToday}
            />
        </div>

        {#if isToday}
            <div class="flex flex-col p-4 bg-gray-50 w-full">
                <hr class="border-2 rounded my-2"/>
                <FooterInformation
                        bind:customerBooking={customerBooking}
                        bind:ableToSendSmsReviewReminder={ableToSendSmsReviewReminder}
                        handleReviewSend={handleReviewSend}
                        handleServicingClick={handleServicingClick}
                        handleCompletedClick={handleCompletedClick}
                />
            </div>
        {/if}
    {/if}
{/if}

<style>
</style>