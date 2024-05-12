<script>
    import CustomerBookingList
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingList.svelte";
    import {bookingStateList} from "$lib/page/protected/business-portal/page_lobby/stores/bookingStateList_store.js";
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {Modal} from "flowbite-svelte";

    let openModal = false;
    let selectedCustomerBooking = {};
    let hasMsg;

    function handleCustomerBookingClick(customerBooking)
    {
        openModal = true;
        selectedCustomerBooking = customerBooking;
        hasMsg = selectedCustomerBooking.message === "";
    }


</script>

<CustomerBookingList
        listName="Completed"
        customerBookingList={$bookingStateList[3]}
        handleCustomerBookingClick={handleCustomerBookingClick}
/>

<!-- Modal for customer booking -->
<div class="">
    <Modal bind:open={openModal} size="md" autoclose outsideclose>
        <div>
            <p><strong>Customer name:</strong> {selectedCustomerBooking.customer.customerName}</p>
            <p><strong>Phone number:</strong> {selectedCustomerBooking.customer.phoneNumber}</p>
            <p><strong>Booking time:</strong> {dayjs(selectedCustomerBooking.bookingTime, formatToTime).format(formatToTimeAM)}</p>
            <p><strong>Check-in time:</strong> {dayjs(selectedCustomerBooking.checkinTime, formatToTime).format(formatToTimeAM)}</p>
            <p><strong>Start time:</strong> {dayjs(selectedCustomerBooking.servicingStartTime, formatToTime).format(formatToTimeAM)}</p>
            <p><strong>End time:</strong> {dayjs(selectedCustomerBooking.servicingEndTime, formatToTime).format(formatToTimeAM)}</p>
            <p class="break-words"><strong>Message:</strong> {selectedCustomerBooking.message}
            {#if !hasMsg}
                <span class="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-sky-400 opacity-75"></span>
            {/if}
            </p>
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
    </Modal>
</div>
