<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import {isTomorrow, now} from "$lib/page/stores/now/now_dayjs_store.js";
    import report_icon from "$lib/images/report_icon/message-report.png";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {
        handleCustomerBookingPortalEditCustomerBooking
    } from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {Button, Tooltip} from "flowbite-svelte";

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

<div class="w-full h-full flex flex-col items-center justify-center p-6 rounded-lg space-y-4">
    <div class="flex items-center justify-center">
        <div class="w-full max-w-4xl">
            <div class="relative text-xl rounded-t-lg font-bold flex bg-white text-blue-900 p-4 border-t-2 border-x-2">
                <span class="whitespace-normal">
                  Your appointment is
                    {#if isTomorrow($bookingEstimate.customerBooking.bookingDate)}
                    <span class="underline">Tomorrow</span>
                    {:else}
                    on <span class="underline">{$bookingEstimate.bookingDateFormatted}</span>
                    {/if}
                    at <span class="underline">{$bookingEstimate.bookingTimeFormatted}</span>.
                </span>
            </div>

            <div class="relative bg-white flex flex-col justify-between text-green-800 p-4 border-x-2 border-b-2 rounded-b-lg w-full">
                <div class="flex flex-col justify-between w-full mt-auto">
                    <span class="flex flex-wrap mt-1">
                        Please visit this link on the day of your appointment for live updates!
                    </span>
                    <span class="flex flex-wrap mt-1">
                        You can edit your appointment online any time
                        <span class="ml-1 font-semibold">before the day of your appointment</span>.
                    </span>
                    <span class="flex flex-wrap mt-1">
                        For further information, you can reach
                        <span class="font-semibold mx-1">{$bookingEstimate.business.businessInfo.businessName}</span>
                        at
                        <span class="font-semibold ml-1">{formatPhoneNumber($bookingEstimate.business.businessInfo.businessPhoneNumber)}</span>.
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div>
        <Button id="show-tooltip"
                on:click={() => handleCustomerBookingPortalEditCustomerBooking($bookingEstimate.customerBooking)}
                color="light" outline> Edit My Booking
            <svg class="ml-1 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
            </svg>
        </Button>
        <Tooltip triggeredBy="#show-tooltip">Edit Booking</Tooltip>
    </div>
</div>

