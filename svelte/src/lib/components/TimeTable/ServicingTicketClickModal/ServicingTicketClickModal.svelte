<script>
    import {tick} from 'svelte';
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {Modal} from "flowbite-svelte";
    import CustomerIndividualServiceBookingComponent
        from "$lib/components/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualServiceBookingComponent/CustomerIndividualServiceBookingComponent.svelte";
    import {
        servicingTicketClickModal
    } from "$lib/components/TimeTable/ServicingTicketClickModal/stores/servicingTicketClickModal.js";
    import {
        findPreselectEmployeeID,
        indicateToSendCustomerBookingToCompleted
    } from "$lib/components/TimeTable/ServicingTicketClickModal/functions.js";
    import {
        findIndividualBookingFromCustomerBooking
    } from "$lib/api/initialize_functions/customer-booking-utility-functions.js";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import Footer from "$lib/components/CustomerBookingClickModal/components/Footer/Footer.svelte";

    export let isToday;
    export let nonModal = false;

    let customerBooking = undefined;
    let individualBooking = undefined;
    let serviceBooking = undefined;

    let indicateSendToCompleted = false;
    $: {
        customerBooking = $servicingTicketClickModal.customerBooking;
        serviceBooking = $servicingTicketClickModal.serviceBooking;

        //console.log("serviceBooking", serviceBooking)

        // Get the individual booking from customer booking and service booking
        if (customerBooking && serviceBooking) {
            individualBooking = findIndividualBookingFromCustomerBooking(customerBooking, serviceBooking.individualID);
            indicateSendToCompleted = indicateToSendCustomerBookingToCompleted(customerBooking);
        }
    }

    function hideParentOfFooter() {
        let footerDiv = document.querySelector('div[slot="footer"]');

        // try finding the div using the id
        if (!footerDiv) {
            footerDiv = document.getElementById('footer');
        }

        // apply 'display: none' to its parent
        if (footerDiv && footerDiv.parentElement) {
            footerDiv.parentElement.style.display = 'none';
        }
    }

    $: if ($servicingTicketClickModal.open) {
        // not sure about reliability but due to svelte basically abandoning fragment manipulation, forced to take shortcuts
        tick().then(() => {
            if (!isToday) {
                hideParentOfFooter();
            }
        });
    }
</script>

<div class="absolute top-0 left-0">
    {#if customerBooking && individualBooking && serviceBooking}
        <Modal bind:open={$servicingTicketClickModal.open}
               size="md"
               outsideclose={!nonModal}
               dismissable={!nonModal}
               classBackdrop={nonModal? "hidden":""}
        >
            <div class="flex flex-col space-y-2">
                <div>
                    <p><strong>Customer name:</strong> {customerBooking.customer.customerName}</p>
                    <p><strong>Booking
                        time:</strong> {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}
                    </p>
                    <p><strong>Number of guest(s):</strong>{customerBooking.customerIndividualBookingList.length}</p>
                    {#if customerBooking.message.length !== 0}
                        <p class="break-words">
                            <strong>Message:</strong> {customerBooking.message}
                        </p>
                    {/if}
                </div>

                <div>
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
            </div>

            <!-- Footer only show if it is today -->
            <div id="footer" slot="footer" class="w-full {isToday ? '':'hidden'}">
                <Footer
                        customerBooking={$servicingTicketClickModal.customerBooking}
                        {indicateSendToCompleted}
                />
            </div>
        </Modal>
    {/if}
</div>
