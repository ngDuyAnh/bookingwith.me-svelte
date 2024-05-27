<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Modal} from "flowbite-svelte";
    import CustomerIndividualServiceBookingComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualServiceBookingComponent/CustomerIndividualServiceBookingComponent.svelte";
    import {
        servicingTicketClickModal
    } from "$lib/components/Timetable/TimetableModal/stores/servicingTicketClickModal.js";
    import {
        findPreselectEmployeeID,
        indicateToSendCustomerBookingToCompleted
    } from "$lib/components/Timetable/TimetableModal/functions.js";
    import {
        moveToCompleted
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getContext} from "svelte";
    import {
        findIndividualBookingFromCustomerBooking
    } from "$lib/api/initialize_functions/customer-booking-utility-functions.js";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";

    export let isToday;

    let customerBooking = undefined;
    let individualBooking = undefined;
    let serviceBooking = undefined;
    let indicateSendToCompleted = false;
    $: {
        customerBooking = $servicingTicketClickModal.customerBooking;
        serviceBooking = $servicingTicketClickModal.serviceBooking;

        console.log("serviceBooking", serviceBooking)

        // Get the individual booking from customer booking and service booking
        if (customerBooking && serviceBooking)
        {
            individualBooking = findIndividualBookingFromCustomerBooking(customerBooking, serviceBooking.individualID);
            indicateSendToCompleted = indicateToSendCustomerBookingToCompleted(customerBooking);
        }
    }

    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleCompletedClick() {
        console.log("Moving to completed:", customerBooking);

        await moveToCompleted($now, customerBooking, submitCustomerBooking);
    }
</script>

<div class="absolute top-0 left-0 right-0">
    {#if customerBooking && individualBooking && serviceBooking}
        <Modal bind:open={$servicingTicketClickModal.open} size="md" outsideclose>
            <p><strong>Customer name:</strong> {customerBooking.customer.customerName}</p>
            <p><strong>Booking time:</strong> {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}</p>
            <p><strong>Number of guest(s):</strong>{customerBooking.customerIndividualBookingList.length}</p>
            {#if customerBooking.message.length !== 0}
                <p class="break-words">
                    <strong>Message:</strong> {customerBooking.message}
                </p>
            {/if}

            <div class="mt-1">
                <div class="font-bold">Selected service:</div>

                {#if isToday && customerBooking.bookingState !== CustomerBookingState.COMPLETED}
                    <div class="border-2 border-green-400 rounded-md">
                        <CustomerIndividualServiceBookingComponent
                                {customerBooking}
                                {serviceBooking}
                                preselectEmployeeID={findPreselectEmployeeID($servicingTicketClickModal.employeeTimetableList, serviceBooking)}
                        />
                    </div>

                    <div class="mt-2">
                        {#if individualBooking.customerIndividualServiceBookingList.length > 1}
                            <div class="font-bold">Other services for this guest:</div>
                            {#each individualBooking.customerIndividualServiceBookingList as individualServiceBooking}
                                {#if serviceBooking.serviceBookingID !== individualServiceBooking.serviceBookingID}
                                    <CustomerIndividualServiceBookingComponent
                                            {customerBooking}
                                            serviceBooking={individualServiceBooking}
                                            preselectEmployeeID={findPreselectEmployeeID($servicingTicketClickModal.employeeTimetableList, individualServiceBooking)}
                                    />
                                {/if}
                            {/each}
                        {/if}
                    </div>

                    <div class="mt-6">
                        {#if customerBooking.customerIndividualBookingList.length > 1}
                            <div class="font-bold">Other related guest(s) for this booking:</div>
                            {#each customerBooking.customerIndividualBookingList as customerIndividualBooking (customerIndividualBooking.individualID)}
                                {#if customerIndividualBooking.individualID !== individualBooking.individualID }
                                    <div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
                                        {#each customerIndividualBooking.customerIndividualServiceBookingList as individualServiceBooking}
                                            <div class="mt-1 p-1">
                                                <CustomerIndividualServiceBookingComponent
                                                        {customerBooking}
                                                        serviceBooking={individualServiceBooking}
                                                        preselectEmployeeID={findPreselectEmployeeID($servicingTicketClickModal.employeeTimetableList, individualServiceBooking)}
                                                />
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            {/each}
                        {/if}
                    </div>

                {:else}
                    <p>{serviceBooking.service.serviceName}</p>
                {/if}
            </div>

            <!--{#if customerBooking.bookingState !== 3 && isToday}
            {/if}-->
            <svelte:fragment slot="footer">
                <div class="w-full mt-4 flex justify-end items-center space-x-2">
                    <span class="text-gray-700 font-bold">Move to:</span>
                    {#if indicateSendToCompleted}
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
            </svelte:fragment>
        </Modal>
    {/if}
</div>
