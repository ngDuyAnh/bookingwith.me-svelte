<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Badge, Tooltip} from "flowbite-svelte";
    import {
        CustomerBookingArrivalStatus,
        CustomerBookingChannel
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {GlobeSolid} from "flowbite-svelte-icons";
    import {shortCustomerBookingID} from "$lib/api/utility_functions/CustomerBooking.js";

    export let customerBooking;

    let msg = customerBooking.message === ""
</script>

<div class="">

    <span class="flex flex-row text-gray-900 font-bold space-x-1">
        <span>{customerBooking.customer.customerName} - {shortCustomerBookingID(customerBooking.id)}</span>
        {#if !msg}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
            </svg>
        {/if}

        {#if customerBooking.bookingChannel === CustomerBookingChannel.ONLINE}
            <button><GlobeSolid color="lightBlue"/></button>
            <Tooltip>Online Booking</Tooltip>
        {/if}

        {#if customerBooking.smsConfirmation === true}
            <button>
                <svg
                        class="w-[18px] h-[18px] text-green-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M5 11.917 9.724 16.5 19 7.5"/>
                </svg>
            </button>
            <Tooltip>Verified Phone Number</Tooltip>
        {/if}

        {#if customerBooking.arrivalStatus === CustomerBookingArrivalStatus.ON_THE_WAY}
            <button><Badge color="green">OWM</Badge></button>
            <Tooltip>On my way!</Tooltip>
        {:else if customerBooking.arrivalStatus === CustomerBookingArrivalStatus.LATE_LESS_THAN_10_MINUTES}
            <button><Badge color="yellow">Late</Badge></button>
            <Tooltip>Less than 10 minutes</Tooltip>
        {:else if customerBooking.arrivalStatus === CustomerBookingArrivalStatus.LATE_GREATER_THAN_10_MINUTES}
            <button><Badge color="red">Late</Badge></button>
            <Tooltip>Greater than 10 minutes</Tooltip>
        {/if}
    </span>

    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
      {customerBooking.customerIndividualBookingList.length} Guests
    </span>
    <span class="block mt-2 text-gray-600 text-sm">
        Booking Time: {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}
    </span>
</div>
