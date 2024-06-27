<script>
    import { onMount } from 'svelte';
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
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

    let tomorrow  = $now.startOf('day').add(1, 'day');
    $: tomorrow = $now.startOf('day').add(1, 'day');

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

    $: console.log("$bookingList.customerBookingList", $bookingList.customerBookingList);
</script>

<input type="date" bind:value={selectedDate} min={tomorrow.format(formatToDate)}/>

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
