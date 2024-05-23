<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {
        customerBookingClickModal
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {
        moveToServicing
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getContext} from "svelte";

    let customerBooking = undefined;
    $: customerBooking = $customerBookingClickModal.customerBooking;

    // Retrieve customer booking list update function
    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleServicingClick() {
        console.log('Moving to servicing:', customerBooking);

        await moveToServicing($now, customerBooking, submitCustomerBooking);
    }
</script>

<div>
    <p><strong>Customer name:</strong> {customerBooking.customer.customerName}</p>
    <p><strong>Phone number:</strong> {customerBooking.customer.phoneNumber}</p>
    <p><strong>Booking time:</strong> {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}</p>
    <p><strong>Check-in time:</strong> {dayjs(customerBooking.checkinTime, formatToTime).format(formatToTimeAm)}</p>
    <p><strong>Start time:</strong> {dayjs(customerBooking.servicingStartTime, formatToTime).format(formatToTimeAm)}</p>
    <p><strong>End time:</strong> {dayjs(customerBooking.servicingEndTime, formatToTime).format(formatToTimeAm)}</p>
    {#if customerBooking.message.length !== 0}
        <p class="break-words">
            <strong>Message:</strong> {customerBooking.message}
        </p>
    {/if}

    <div class="mt-4">
        <div class="font-bold">Guest(s):</div>
        {#each customerBooking.customerIndividualBookingList as individualBooking}
            <div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
                {#each individualBooking.customerIndividualServiceBookingList as serviceBooking}
                    <div class="mt-1 p-1">
                        <p>{serviceBooking.service.serviceName}
                            ({serviceBooking.employee?.employeeName || 'Any'})</p>
                    </div>
                {/each}
            </div>
        {/each}
    </div>
</div>

<div class="mt-4 flex ">
    <div class="ml-auto justify-end items-center space-x-2">
        <span class="text-gray-700 font-bold">Move to:</span>
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                on:click={handleServicingClick}>Servicing
        </button>
    </div>
</div>