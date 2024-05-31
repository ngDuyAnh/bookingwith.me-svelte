<script>
    import { onMount } from 'svelte';
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getAppointmentBookingList} from "$lib/api/api_server/lobby-portal/api.js";
    import {formatToDate, formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import CustomerBookingListItem
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingListItem/CustomerBookingListItem.svelte";
    import dayjs from "dayjs";
    import {Button, Modal, Tooltip} from "flowbite-svelte";
    import {deleteBooking} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {business} from "$lib/page/protected/stores/business.js";
    import {handleEditCustomerBooking} from "$lib/components/Modal/EditCustomerBooking/editCustomerBooking.js";
    import {cancelScheduledReminderSms} from "$lib/api/api_twilio/api.js";

    let tomorrow  = $now.startOf('day').add(1, 'day');
    $: tomorrow = $now.startOf('day').add(1, 'day');

    let selectedDate = tomorrow.format(formatToDate);
    let customerBookingList = [];

    let openModal = false;
    let selectedCustomerBooking = {};

    async function fetchBookingsForDate()
    {
        // Ensure the boundary for date
        if (dayjs(selectedDate, formatToDate).startOf('day').isBefore(tomorrow))
        {
            selectedDate = tomorrow.format(formatToDate);
        }

        try
        {
            const response = await getAppointmentBookingList($business.businessInfo.businessID, selectedDate);
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
            // Remove the scheduled sms appointment reminder
            cancelScheduledReminderSms(selectedCustomerBooking);

            // Mark the customer booking as deleted in the database
            await deleteBooking($business.businessInfo.businessID, selectedCustomerBooking.id);

            // Re-fetch the customer booking list
            await fetchBookingsForDate(selectedDate);
        }
    }
</script>

<input type="date" bind:value={selectedDate} min={tomorrow.format(formatToDate)}/>

<!-- Appointment list -->
<div class="overflow-y-auto">
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
</div>

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

        <div class="mt-4 flex ">
            <div class="justify-start">
                <Button id="show-tooltip" on:click={() => handleEditCustomerBooking(selectedCustomerBooking)} color="light" outline>
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                    </svg>
                </Button>
                <Tooltip triggeredBy="#show-tooltip">Edit Booking</Tooltip>
            </div>

            <div class="ml-auto justify-end items-center space-x-2">
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" on:click={handleRemoveBookingClick}>Remove</button>
            </div>
        </div>
    </Modal>
</div>
