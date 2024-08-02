<script>
    import {onMount} from 'svelte';
    import {business, isTomorrow, now} from "$lib/page/stores/business/business.js";
    import {formatToDate} from "$lib/application/Formatter.js";
    import CustomerBookingListItem
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingListItem/CustomerBookingListItem.svelte";
    import dayjs from "dayjs";
    import {
        bookingList,
        fetchAppointmentCustomerBookingList
    } from "$lib/page/protected/business-portal/page_lobby/page/BookingList/stores/bookingList.js";
    import {
        handleBookingListCustomerBookingClick
    } from "$lib/page/protected/business-portal/page_lobby/page/BookingList/components/BookingListCustomerBookingClickModal/stores/BookingListCustomerBookingClickModal.js";
    import BookingListCustomerBookingClickModal
        from "$lib/page/protected/business-portal/page_lobby/page/BookingList/components/BookingListCustomerBookingClickModal/BookingListCustomerBookingClickModal.svelte";
    import {ChevronLeftOutline, ChevronRightOutline} from "flowbite-svelte-icons";
    import {Button, Search} from "flowbite-svelte";
    import {normalizeSearchInput} from "$lib/application/NormalizeSearchInput.js";
    import {shortCustomerBookingID} from "$lib/api/utility_functions/CustomerBooking.js";

    let tomorrow = $now.startOf('day').add(1, 'day');

    let selectedDate = tomorrow.format(formatToDate);

    function fetchBookingsForDate() {
        // Ensure the boundary for date to be the future
        if (dayjs(selectedDate, formatToDate).startOf('day').isBefore(tomorrow)) {
            selectedDate = tomorrow.format(formatToDate);
        }

        // Get the customer booking list
        fetchAppointmentCustomerBookingList($business.businessInfo.businessID, selectedDate);
    }

    onMount(() => {
        fetchBookingsForDate();
    });

    // Date select change
    $: if ($bookingList.date !== selectedDate) {
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

    $: if (searchValue.length >= 0 || $bookingList.customerBookingList) {
        handleSearchFilter();
    }

    let searchValue = '';
    let filteredCustomerBookingList = $bookingList.customerBookingList;

    function handleSearchFilter() {
        const normalizedSearchValue = normalizeSearchInput(searchValue);

        // Assume $customerBookingQueueList is structured like: [ [], [], [], [] ]
        // where each sub-array represents bookings in different states: 0->appointment, 1->lobby, 2->servicing, 3->completed
        if (searchValue.length === 0) {
            filteredCustomerBookingList = $bookingList.customerBookingList;
        } else {
            filteredCustomerBookingList = $bookingList.customerBookingList.filter(booking =>
                normalizeSearchInput(booking.customer.customerName).includes(normalizedSearchValue) ||
                normalizeSearchInput(shortCustomerBookingID(booking.id)).includes(normalizedSearchValue) ||
                normalizeSearchInput(booking.customer.phoneNumber.toString()).includes(normalizedSearchValue)
            );
        }
    }

    $: console.log("$bookingList.customerBookingList", $bookingList.customerBookingList);
</script>

<div
        class="relative flex flex-col items-center justify-center sm:w-5/6 w-11/12 h-full mx-auto my-2 overflow-x-auto space-y-1"
>
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

        <form class="flex max-w-xs items-center">
            <Search bind:value={searchValue} size="md" class="rounded-none rounded-l-lg py-2.5"
                    placeholder="Search Booking Info" maxlength="20">
            </Search>
        </form>
    </div>

    <div class="overflow-y-auto rounded border-2 w-full flex-1">
        {#if $bookingList.customerBookingList.length === 0}
            <div class="flex justify-center w-full h-full">
                <span class="text-lg font-semibold">No Appointments for {selectedDate}</span>
            </div>
        {:else}
            <!-- Appointment list -->

            <ul>
                {#each filteredCustomerBookingList as customerBooking (customerBooking.id)}
                    <li class="border-b last:border-b-0">
                        <button
                                class="mb-4 p-4 bg-white rounded shadow select-none w-full text-left
                            hover:bg-gray-300 transition-all duration-300 ease-in-out"
                                on:click={() => handleBookingListCustomerBookingClick(customerBooking)}
                        >
                            <CustomerBookingListItem {customerBooking}/>
                        </button>
                    </li>
                {/each}
            </ul>
        {/if}
    </div>


</div>


<!-- Modal for customer booking -->
<BookingListCustomerBookingClickModal/>
