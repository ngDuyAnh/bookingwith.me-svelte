<script>
    import CustomerBookingList
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingList.svelte";
    import {bookingStateList} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {Modal} from "flowbite-svelte";
    import {getContext} from "svelte";
    import CustomerIndividualBooking
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/CustomerIndividualBooking/CustomerIndividualBooking.svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {moveToCompleted} from "$lib/api/api_server/lobby-portal/utility-functions/handle_customer_booking_state.js";

    let openModal = false;
    let selectedCustomerBooking = {};

    function handleCustomerBookingClick(customerBooking)
    {
        openModal = true;
        selectedCustomerBooking = customerBooking;
    }

    // Retrieve customer booking list update function
    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleCompleteClick()
    {
        console.log('Moving to completed:', selectedCustomerBooking);

        await moveToCompleted($now, selectedCustomerBooking, submitCustomerBooking);
    }
</script>

<CustomerBookingList
        listName="In Progress..."
        customerBookingList={$bookingStateList[2]}
        handleCustomerBookingClick={handleCustomerBookingClick}
/>


<!-- Modal for customer booking -->
<div class="absolute top-0 left-0 right-0">
    <Modal bind:open={openModal} size="md" autoclose outsideclose>
        <div>
            <p><strong>Customer name:</strong> {selectedCustomerBooking.customer.customerName}</p>
            <p><strong>Phone number:</strong> {selectedCustomerBooking.customer.phoneNumber}</p>
            <p><strong>Booking time:</strong> {dayjs(selectedCustomerBooking.bookingTime, formatToTime).format(formatToTimeAM)}</p>
            <p><strong>Check-in time:</strong> {dayjs(selectedCustomerBooking.checkinTime, formatToTime).format(formatToTimeAM)}</p>
            <p><strong>Start time:</strong> {dayjs(selectedCustomerBooking.servicingStartTime, formatToTime).format(formatToTimeAM)}</p>
            <p class="break-words"><strong>Message:</strong> {selectedCustomerBooking.message}</p>
            <div class="mt-4">
                <div class="font-bold">Guest(s):</div>
                {#each selectedCustomerBooking.customerIndividualBookingList as individualBooking (individualBooking.individualID)}
                    <CustomerIndividualBooking
                            customerBooking={selectedCustomerBooking}
                            {individualBooking}
                    />
                {/each}
            </div>
        </div>

        <div class="mt-4 flex justify-end items-center space-x-2">
            <span class="text-gray-700 font-bold">Move to:</span>
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" on:click={handleCompleteClick}>Complete</button>
        </div>
    </Modal>
</div>
