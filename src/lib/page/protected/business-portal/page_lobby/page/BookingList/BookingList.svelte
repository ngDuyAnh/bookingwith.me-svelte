<script>
    import { onMount } from 'svelte';
    import {now} from "$lib/page/protected/stores/now/now_dayjs_store.js";
    import {getAppointmentBookingList} from "$lib/api_server/lobby-portal/api.js";
    import {user} from "$lib/page/protected/stores/user.js";
    import {formatToDate, formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import CustomerBookingListItem
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingListItem/CustomerBookingListItem.svelte";
    import dayjs from "dayjs";
    import {Modal} from "flowbite-svelte";
    import {deleteBooking} from "$lib/api_server/customer-booking-portal/api.js";

    let tomorrow  = $now.add(1, 'day').format(formatToDate); // default to today
    let selectedDate = tomorrow;
    let customerBookingList = [];

    let openModal = false;
    let selectedCustomerBooking = {};

    async function fetchBookingsForDate()
    {
        try
        {
            const response = await getAppointmentBookingList($user.businessId, selectedDate);
            customerBookingList = response.customerBookingList;
        }
        catch (error)
        {
            console.error(error);
            customerBookingList = [];
        }

        console.log("fetchBookingsForDate()", customerBookingList);
    }

    onMount(() => {
        fetchBookingsForDate(selectedDate);
    });

    $: fetchBookingsForDate(selectedDate);

    function handleCustomerBookingClick(customerBooking)
    {
        openModal = true;
        selectedCustomerBooking = {...customerBooking};
    }

    async function handleRemoveBookingClick()
    {
        if (confirm("Are you sure you want to cancel this appointment?"))
        {
            await deleteBooking(selectedCustomerBooking.id);

            // Re-fetch the customer booking list
            await fetchBookingsForDate(selectedDate);
        }
    }
</script>

<input type="date" bind:value={selectedDate} min={tomorrow}/>

<!-- Appointment list -->
<ul>
    {#each customerBookingList as customerBooking (customerBooking.id)}
        <li class="border-b last:border-b-0">
            <button
                    class="mb-4 p-4 bg-white rounded shadow select-none w-full text-left
                            hover:bg-gray-300 transition-all duration-300 ease-in-out"
                    on:click={() => handleCustomerBookingClick(customerBooking)}
            >
                <CustomerBookingListItem {customerBooking} />
            </button>
        </li>
    {/each}
</ul>

<!-- Modal for customer booking -->
<div class="absolute top-0 left-0 right-0">
    <Modal bind:open={openModal} size="md" autoclose outsideclose>
        <div>
            <p><strong>Customer name:</strong> {selectedCustomerBooking.customer.customerName}</p>
            <p><strong>Phone number:</strong> {selectedCustomerBooking.customer.phoneNumber}</p>
            <p><strong>Booking time:</strong> {dayjs(selectedCustomerBooking.bookingTime, formatToTime).format(formatToTimeAM)}</p>
            <p class="break-words"><strong>Message:</strong> {selectedCustomerBooking.message}</p>
            <div class="mt-4">
                <div class="font-bold">Guest(s):</div>
                {#each selectedCustomerBooking.customerIndividualBookingList as individualBooking}
                    <div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
                        {#each individualBooking.customerIndividualServiceBookingList as serviceBooking}
                            <div class="mt-1 p-1">
                                <p>{serviceBooking.service.serviceName} ({serviceBooking.employee?.employeeName || 'Any'})</p>
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>

        <div class="mt-4 flex justify-end items-center space-x-2">
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" on:click={handleRemoveBookingClick}>Remove</button>
        </div>
    </Modal>
</div>
