<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";

    export let customerBooking;

    let msg = customerBooking.message === ""
</script>

<div class="">

    <span class="flex flex-row text-gray-900 font-bold">
        {customerBooking.customer.customerName} - {customerBooking.customer.phoneNumber}
        {#if !msg}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
            </svg>
        {/if}
    </span>

    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
      {customerBooking.customerIndividualBookingList.length} Guests
    </span>
    <span class="block mt-2 text-gray-600 text-sm">
        Booking Time: {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAM)}
    </span>
</div>
