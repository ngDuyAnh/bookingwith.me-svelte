<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import report_icon from "$lib/images/report_icon/message-report.png";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {isTomorrow} from "$lib/page/stores/now/now_dayjs_store.js";
    import {
        handleCustomerBookingPortalEditCustomerBooking,
        handleEditCustomerBooking
    } from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {Button, Tooltip} from "flowbite-svelte";
    import ModalEditCustomerBooking from "$lib/components/Modal/EditCustomerBooking/ModalEditCustomerBooking.svelte";

    //$:console.log($bookingEstimate);
</script>

<div class="p-6">
    <h2 class="text-lg md:text-xl lg:text-2xl font-light text-gray-800 flex-grow">
        Today: {$now.format('ddd, MMM D YYYY')}
    </h2>

    <div class="absolute top-3 right-3 md:top-4 md:right-4">
        <a href="/report" class="block hover:scale-110 transition-transform duration-300">
            <img src={report_icon}
                 alt="Kid's helpline"
                 title="Kid's helpline"
                 class="w-8 h-8"/>
        </a>
    </div>


</div>
<div class="p-6 rounded-lg space-y-4">
    <p class="bg-blue-100 text-blue-700 font-semibold rounded-lg p-4 shadow">
        Your appointment is
        {#if isTomorrow($bookingEstimate.customerBooking.bookingDate)}
            <span class="underline">Tomorrow</span>
        {:else}
            on <span class="underline">{$bookingEstimate.bookingDateFormatted}</span>

        {/if}
        at
        <span class="underline">{$bookingEstimate.bookingTimeFormatted}</span>.
    </p>


    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        Please visit this link on the day of your appointment for live updates!
    </div>

    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        You can edit your appointment online any time
        <span class="font-semibold">before the day of your appointment</span>.
    </div>

    <div class="mt-2 bg-green-100 text-green-800 rounded-lg p-4 shadow">
        For further information, you can reach
        <span class="font-semibold">{$bookingEstimate.business.businessInfo.businessName}</span>
        at
        <span class="font-semibold">{formatPhoneNumber($bookingEstimate.business.businessInfo.businessPhoneNumber)}</span>.
    </div>
</div>

<div>
    <Button id="show-tooltip" on:click={() => handleCustomerBookingPortalEditCustomerBooking($bookingEstimate.customerBooking)} color="light" outline>
        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
        </svg>
    </Button>
    <Tooltip triggeredBy="#show-tooltip">Edit Booking</Tooltip>
</div>
