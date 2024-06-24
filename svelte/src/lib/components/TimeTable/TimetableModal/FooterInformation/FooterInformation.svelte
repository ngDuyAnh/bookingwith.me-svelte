<script>
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        servicingTicketClickModal,
        servicingTicketClickModalToggleOpen
    } from "$lib/components/TimeTable/TimetableModal/stores/servicingTicketClickModal.js";
    import {
        handleLobbyPortalEditCustomerBooking
    } from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {BusinessScheduleManagement} from "$lib/api/initialize_functions/Business.js";
    import {Button, Tooltip} from "flowbite-svelte";

    export let customerBooking;
    export let ableToSendSmsReviewReminder;
    export let handleReviewSend;
    export let handleServicingClick;
    export let handleCompletedClick;


</script>
<div class="flex w-full">
    <!--Left options-->
    <div class="justify-start">

        <!--Edit the booking-->
        {#if customerBooking.bookingState !== CustomerBookingState.COMPLETED}

            <!--Edit customer booking-->
            <Button id="show-tooltip" color="light" outline
                    on:click={() => {
                                        servicingTicketClickModalToggleOpen();
                                        handleLobbyPortalEditCustomerBooking($servicingTicketClickModal.customerBooking)
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

        {:else}
            <!--Customer booking state is COMPLETED, show the option to send review reminder-->
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
        {/if}
    </div>

    <!--Right options-->
    <div class="ml-auto justify-end content-center space-x-2">

        <!--Only passive and management can move customer booking state-->
        {#if $business.businessInfo.scheduleManagement !== BusinessScheduleManagement.NONE}

            <!--Passive management-->
            {#if $business.businessInfo.scheduleManagement === BusinessScheduleManagement.PASSIVE}
                <span class="text-gray-700 font-bold">Move to:</span>

                <!--Customer booking state is APPOINTMENT OR LOBBY-->
                {#if customerBooking.bookingState < CustomerBookingState.SERVICING}
                    <Button
                            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            on:click={handleServicingClick}>Servicing
                    </Button>
                {/if}

                <!--Customer booking state is SERVICING-->
                {#if customerBooking.bookingState === CustomerBookingState.SERVICING}
                    <Button
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            on:click={handleCompletedClick}>Complete
                    </Button>
                {/if}
            {/if}

            <!--Active management-->
            {#if $business.businessInfo.scheduleManagement === BusinessScheduleManagement.ACTIVE}

                <!--Customer booking state is APPOINTMENT OR LOBBY-->
                {#if customerBooking.bookingState === CustomerBookingState.SERVICING}
                    <span class="text-gray-700 font-bold">Move to:</span>

                    <Button
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            on:click={handleCompletedClick}>Complete
                    </Button>
                {:else if customerBooking.bookingState === CustomerBookingState.COMPLETED}
                    <span class="text-gray-700 font-bold">Move to:</span>

                    <Button
                            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            on:click={handleServicingClick}>Servicing
                    </Button>
                {/if}
            {/if}
        {/if}
    </div>
</div>
