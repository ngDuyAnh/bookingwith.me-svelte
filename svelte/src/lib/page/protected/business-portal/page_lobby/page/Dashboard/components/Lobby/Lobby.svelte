<script>
    import CustomerBookingList
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingList.svelte";
    import {bookingStateList} from "$lib/page/protected/business-portal/page_lobby/stores/bookingStateList_store.js";
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {Modal} from "flowbite-svelte";
    import {getContext} from "svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {moveToServicing, moveToCompleted} from "$lib/api/api_server/lobby-portal/utility-functions/handle_customer_booking_state.js";

    let openModal = false;
    let selectedCustomerBooking = {};

    function handleCustomerBookingClick(customerBooking)
    {
        openModal = true;
        selectedCustomerBooking = {...customerBooking};
    }

    // Retrieve customer booking list update function
    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleServicingClick() {
        console.log('Start servicing:', selectedCustomerBooking);

        await moveToServicing($now, selectedCustomerBooking, submitCustomerBooking);
    }

    async function handleCompleteClick()
    {
        console.log('Moving to completed:', selectedCustomerBooking);

        await moveToCompleted($now, selectedCustomerBooking, submitCustomerBooking);
    }
</script>

<CustomerBookingList
        listName="Lobby"
        customerBookingList={$bookingStateList[1]}
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
            <span class="text-gray-700 font-bold">Move to:</span>
            <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" on:click={handleServicingClick}>Servicing</button>
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" on:click={handleCompleteClick}>Complete</button>
        </div>
    </Modal>
</div>
