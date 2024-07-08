<script>
    import {tick} from 'svelte';
    import {Modal} from "flowbite-svelte";
    import {
        servicingTicketClickModal
    } from "$lib/components/TimeTable/ServicingTicketClickModal/stores/servicingTicketClickModal.js";
    import {
        indicateToSendCustomerBookingToCompleted
    } from "$lib/components/TimeTable/ServicingTicketClickModal/functions.js";
    import {
        findIndividualBookingFromCustomerBooking
    } from "$lib/api/initialize_functions/utilitiy_functions/CustomerBooking.js";
    import Footer from "$lib/components/Modal/CustomerBookingClickModal/components/Footer/Footer.svelte";
    import TicketInformation from "$lib/components/TimeTable/TimetableModal/TicketInformation/TicketInformation.svelte";

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

{#if customerBooking && individualBooking && serviceBooking}
    {#if !nonModal}
        <div class="absolute top-0 left-0 right-0">

            <Modal bind:open={$servicingTicketClickModal.open} size="md" outsideclose={!nonModal}
                   dismissable={!nonModal}
                   classBackdrop={nonModal? "hidden":""} class="lg:max-h-[80vh]" classDialog="{nonModal? 'z-[0]':''}"
            >
                <TicketInformation bind:customerBooking={customerBooking}
                                   bind:individualBooking={individualBooking}
                                   bind:serviceBooking={serviceBooking}
                                   bind:isToday={isToday}
                />

                <!-- Footer only show if it is today -->
                <div id="footer" slot="footer" class="w-full
                    {isToday ? '':'hidden'}">
                    <Footer
                            customerBooking={$servicingTicketClickModal.customerBooking}
                            {indicateSendToCompleted}
                    />
                </div>
            </Modal>
        </div>
    {:else}
        <div class="flex flex-col p-4 bg-gray-50 w-full h-full overflow-y-auto">
            <TicketInformation bind:customerBooking={customerBooking}
                               bind:individualBooking={individualBooking}
                               bind:serviceBooking={serviceBooking}
                               bind:isToday={isToday}
            />
        </div>
        {#if isToday}
            <div class="flex flex-col p-4 bg-gray-50 w-full">
                <hr class="border-2 rounded my-2"/>
                <Footer
                        customerBooking={$servicingTicketClickModal.customerBooking}
                        {indicateSendToCompleted}
                />
            </div>
        {/if}
    {/if}
{/if}