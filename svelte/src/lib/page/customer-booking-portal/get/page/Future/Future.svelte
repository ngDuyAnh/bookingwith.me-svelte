<script>
    import {customerBookingEstimate} from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
    import {isTomorrow, now} from "$lib/page/stores/now/now_dayjs_store.js";
    import report_icon from "$lib/images/report_icon/message-report.png";
    import {
        handleCustomerBookingPortalEditCustomerBooking
    } from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {Button} from "flowbite-svelte";
    import LiveIndicator
        from "$lib/page/customer-booking-portal/get/page/components/LiveIndicator/LiveIndicator.svelte";
    import {customerBooking} from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
    import {business} from "$lib/page/stores/business/business.js";
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

<div class="p-2 h-full w-full flex flex-col items-center justify-center">
    <!-- Appointment information box -->
    <div class="bg-white max-w-4xl border-2 rounded-lg">
        <!-- Appointment header -->
        <div class="p-4 text-xl font-bold text-blue-900">
            <div class="flex flex-col items-center sm:flex-row sm:items-center justify-center sm:justify-between w-full">
                <span class="block sm:inline mb-2 sm:mb-0">
                    Your appointment is

                    {#if isTomorrow($customerBooking.bookingDate)}
                            <span class="underline">Tomorrow</span>
                    {:else}
                        on <span class="underline">{$customerBookingEstimate.bookingDateFormatted}</span>
                    {/if}

                    at <span class="underline">{$customerBookingEstimate.bookingTimeFormatted}</span>.
                </span>
                <LiveIndicator/>
            </div>
        </div>

        <!-- Appointment information -->
        <div class="p-4 text-green-800 text-sm">
            Please visit this link on the day of your appointment for live updates!
        </div>

        <div class="p-4 flex flex-col justify-between text-red-800">
            <span class="flex flex-wrap">
                You can edit your appointment online any time
                <span class="ml-1 font-semibold">before the day of your appointment</span>.
            </span>
        </div>
    </div>

    <!-- Action options -->
    <div class="mt-4 flex flex-wrap justify-center">
        <Button
                class="mr-2"
                on:click={() => handleCustomerBookingPortalEditCustomerBooking($customerBooking)}
                color="light" outline> Edit my appointment
            <svg class="ml-1 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
            </svg>
        </Button>

        <a
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                href="tel:{$business.businessInfo.businessPhoneNumber}"
                target="_blank"
                type="button"
        >
            <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    fill="currentColor"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z"/>
            </svg>
        </a>
    </div>
</div>
