<script>
import dayjs from "dayjs";
import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
import CustomerIndividualServiceBooking
    from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/CustomerIndividualBooking/CustomerIndividualServiceBooking/CustomerIndividualServiceBooking.svelte";
import {Modal} from "flowbite-svelte";

export let openModal;
export let customerBooking;
export let individualBooking;
export let serviceBooking;
export let preselectEmployee;
export let isToday;
export let indicateToSendCustomerBookingToCompleted;
export let handleCompletedClick;


</script>

<div class="absolute top-0 left-0 right-0" style="z-index: 1006;">
    <Modal autoclose bind:open={openModal} outsideclose size="md">
        <div>
            <p>
                <strong>Customer name:</strong>
                {customerBooking.customer.customerName}
            </p>
            <p>
                <strong>Booking time:</strong>
                {dayjs(customerBooking.bookingTime, formatToTime).format(
                    formatToTimeAm
                )}
            </p>
            <p>
                <strong>Number of guest(s):</strong>
                {customerBooking.customerIndividualBookingList.length}
            </p>
            <p class="break-words">
                <strong>Message:</strong>
                {customerBooking.message}
            </p>

            <div class="mt-1 p-1">
                <div class="font-bold">Service:</div>

                {#if customerBooking.bookingState !== 3 && isToday}
                    <CustomerIndividualServiceBooking
                            {customerBooking}
                            {individualBooking}
                            {serviceBooking}
                            {preselectEmployee}
                    />

                    <div class="mt-4 flex justify-end items-center space-x-2">
                        <span class="text-gray-700 font-bold">Move to:</span>
                        {#if indicateToSendCustomerBookingToCompleted}
                            <button
                                    class="animate-pulse bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    on:click={handleCompletedClick}>Complete
                            </button>
                        {:else}
                            <button
                                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    on:click={handleCompletedClick}>Complete
                            </button>
                        {/if}
                    </div>
                {:else}
                    <p>{serviceBooking.service.serviceName}</p>
                {/if}
            </div>
        </div>
    </Modal>
</div>
