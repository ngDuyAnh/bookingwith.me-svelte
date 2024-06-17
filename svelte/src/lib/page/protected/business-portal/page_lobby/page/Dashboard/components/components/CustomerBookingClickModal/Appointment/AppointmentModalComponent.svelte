<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Button, Tooltip} from "flowbite-svelte";
    import {
        customerBookingClickModal
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {
        moveToCompleted,
        moveToLobby,
        moveToServicing
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getContext} from "svelte";
    import {handleLobbyPortalEditCustomerBooking} from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {BusinessScheduleManagement} from "$lib/api/initialize_functions/Business.js";
    import {sendSmsAppointment} from "$lib/api/api_twilio/functions.js";

    // Retrieve customer booking list update function
    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleSendSmsAppointment()
    {
        if (!$customerBookingClickModal.customerBooking.smsAppointmentSent) {
            sendSmsAppointment($business.businessInfo.businessName, $customerBookingClickModal.customerBooking)
                .then(() => {
                    console.log('Sent SMS appointment ready soon reminder.');

                    // Record appointment SMS to the database
                    $customerBookingClickModal.customerBooking.smsAppointmentSent = true;
                    submitCustomerBooking($customerBookingClickModal.customerBooking);
                })
                .catch(error => {
                    console.error('Failed to send SMS appointment ready soon reminder:', error);
                });
        }
    }

    async function handleLobbyClick() {
        moveToLobby($now, $customerBookingClickModal.customerBooking, submitCustomerBooking);
    }

    async function handleServicingClick() {
        moveToServicing($now, $customerBookingClickModal.customerBooking, submitCustomerBooking);
    }

    async function handleCompleteClick() {
        moveToCompleted($now, $customerBookingClickModal.customerBooking, submitCustomerBooking);
    }
</script>

<div>
    <p><strong>Customer name:</strong> {$customerBookingClickModal.customerBooking.customer.customerName}</p>
    <p><strong>Phone number:</strong> {$customerBookingClickModal.customerBooking.customer.phoneNumber}</p>
    <p><strong>Booking
        time:</strong> {dayjs($customerBookingClickModal.customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}
    </p>
    {#if $customerBookingClickModal.customerBooking.message.length !== 0}
        <p class="break-words">
            <strong>Message:</strong> {$customerBookingClickModal.customerBooking.message}
        </p>
    {/if}

    <div class="mt-4">
        <div class="font-bold">Guest(s):</div>
        {#each $customerBookingClickModal.customerBooking.customerIndividualBookingList as individualBooking}
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

<div class="mt-4 flex">

    <!--Left options-->
    <div class="justify-start">
        <Button
                color="light"
                outline
                on:click={() => handleLobbyPortalEditCustomerBooking($customerBookingClickModal.customerBooking)}
        >
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
            </svg>
        </Button>
        <Tooltip>Edit booking</Tooltip>

        <!--Send review reminder for NONE schedule management-->
        {#if $business.businessInfo.scheduleManagement === BusinessScheduleManagement.NONE}
            <Button disabled={$customerBookingClickModal.customerBooking.smsAppointmentSent}
                    id="show-tooltip"
                    color="light" outline
                    on:click={handleSendSmsAppointment}
            >
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z"/>
                </svg>
            </Button>
            {#if !$customerBookingClickModal.customerBooking.smsAppointmentSent}
                <Tooltip>Send SMS ready soon</Tooltip>
            {:else}
                <Tooltip>Reminder already sent</Tooltip>
            {/if}
        {/if}
    </div>

    <!--Right options-->
    <div class="ml-auto justify-end content-center space-x-2">
        <span class="text-gray-700 font-bold">Move to:</span>

        <Button class="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleLobbyClick}>Lobby
        </Button>
        <Button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleServicingClick}>Servicing
        </Button>
        <Button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleCompleteClick}>Complete
        </Button>
    </div>
</div>
