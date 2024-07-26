<script>
    import { onMount } from 'svelte';
    import {isTomorrow, now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate} from "$lib/application/Formatter.js";
    import CustomerBookingListItem
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingListItem/CustomerBookingListItem.svelte";
    import dayjs from "dayjs";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        bookingList, fetchAppointmentCustomerBookingList
    } from "$lib/page/protected/business-portal/page_lobby/page/BookingList/stores/bookingList.js";
    import {
        handleBookingListCustomerBookingClick
    } from "$lib/page/protected/business-portal/page_lobby/page/BookingList/components/BookingListCustomerBookingClickModal/stores/BookingListCustomerBookingClickModal.js";
    import BookingListCustomerBookingClickModal
        from "$lib/page/protected/business-portal/page_lobby/page/BookingList/components/BookingListCustomerBookingClickModal/BookingListCustomerBookingClickModal.svelte";
    import {ChevronLeftOutline, ChevronRightOutline} from "flowbite-svelte-icons";
    import {Button} from "flowbite-svelte";

    let tomorrow = $now.startOf('day').add(1, 'day');

    let selectedDate = tomorrow.format(formatToDate);

    function fetchBookingsForDate()
    {
        // Ensure the boundary for date to be the future
        if (dayjs(selectedDate, formatToDate).startOf('day').isBefore(tomorrow))
        {
            selectedDate = tomorrow.format(formatToDate);
        }

        // Get the customer booking list
        fetchAppointmentCustomerBookingList($business.businessInfo.businessID, selectedDate);
    }

    onMount(() => {
        fetchBookingsForDate();
    });

    // Date select change
    $: if ($bookingList.date !== selectedDate)
    {
        fetchBookingsForDate();
    }

    function selectToTomorrow() {
        selectedDate = tomorrow.format(formatToDate);
    }

    function selectTomorrow() {
        selectedDate = dayjs(selectedDate).add(1, "day").format(formatToDate);
    }

    function selectYesterday() {
        selectedDate = dayjs(selectedDate).subtract(1, "day").format(formatToDate);
    }

    $: console.log("$bookingList.customerBookingList", $bookingList.customerBookingList);
</script>

<div
        class="flex sm:flex-row flex-col left-0 inline-block h-fit sm:space-y-0 space-y-1 items-center justify-evenly w-full"
>
    <div class="flex flex-row sm:justify-normal justify-center items-center">
        <Button
                class="h-fit text-md mr-1"
                size="xs"
                color="light"
                on:click={() => {
          selectToTomorrow();
        }}
                disabled={isTomorrow(selectedDate)}
        >Tomorrow
        </Button>
        <div class="flex items-center">
            <Button
                    class="rounded-r-none h-fit"
                    size="xs"
                    color="light"
                    on:click={() => {
            selectYesterday();
          }}
            >
                <ChevronLeftOutline class="w-6 h-6"/>
            </Button>
            <input
                    class="border-gray-300 w-[8rem]"
                    bind:value={selectedDate}
                    type="date"
            />
            <Button
                    class="rounded-l-none h-fit"
                    size="xs"
                    color="light"
                    on:click={() => {
            selectTomorrow();
          }}
            >
                <ChevronRightOutline class="w-6 h-6"/>
            </Button>
        </div>
    </div>
</div>

<!-- Appointment list -->
<div class="overflow-y-auto">
    <ul>
        {#each $bookingList.customerBookingList as customerBooking (customerBooking.id)}
            <li class="border-b last:border-b-0">
                <button
                        class="mb-4 p-4 bg-white rounded shadow select-none w-full text-left
                            hover:bg-gray-300 transition-all duration-300 ease-in-out"
                        on:click={() => handleBookingListCustomerBookingClick(customerBooking)}
                >
                    <CustomerBookingListItem {customerBooking} />
                </button>
            </li>
        {/each}
    </ul>
</div>

<!-- Modal for customer booking -->
<BookingListCustomerBookingClickModal/>
