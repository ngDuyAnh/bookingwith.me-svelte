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
    import {handleEditCustomerBooking} from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";

    let customerBooking = undefined;
    $: customerBooking = $customerBookingClickModal.customerBooking;

    // Retrieve customer booking list update function
    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleLobbyClick()
    {
        console.log('Moving to lobby:', customerBooking);

        await moveToLobby($now, customerBooking, submitCustomerBooking);
    }

    async function handleServicingClick() {
        console.log('Moving to servicing:', customerBooking);

        await moveToServicing($now, customerBooking, submitCustomerBooking);
    }

    async function handleCompleteClick() {
        console.log('Moving to completed:', customerBooking);

        await moveToCompleted($now, customerBooking, submitCustomerBooking);
    }
</script>

<div>
    <p><strong>Customer name:</strong> {customerBooking.customer.customerName}</p>
    <p><strong>Phone number:</strong> {customerBooking.customer.phoneNumber}</p>
    <p><strong>Booking time:</strong> {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}</p>
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
        <Button id="show-tooltip" on:click={() => handleEditCustomerBooking(customerBooking)} color="light" outline>
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
            </svg>
        </Button>
        <Tooltip triggeredBy="#show-tooltip">Edit Booking</Tooltip>
    </div>
    <div class="ml-auto justify-end items-center space-x-2">
        <span class="text-gray-700 font-bold">Move to:</span>
        <button class="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleLobbyClick}>Lobby
        </button>
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleServicingClick}>Servicing
        </button>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleCompleteClick}>Complete
        </button>
    </div>
</div>