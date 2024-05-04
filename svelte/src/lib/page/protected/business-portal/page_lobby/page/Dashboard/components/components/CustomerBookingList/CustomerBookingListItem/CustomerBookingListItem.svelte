<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";

    export let customerBooking;
</script>

<div>
    <span class="block text-gray-900 font-bold">
        {customerBooking.customer.customerName} - {customerBooking.customer.phoneNumber}
    </span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
      {customerBooking.customerIndividualBookingList.length} Guests
    </span>
    <span class="block mt-2 text-gray-600 text-sm">
        Booking Time: {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAM)}
    </span>
</div>
