<script>
    import {Button, Toast} from 'flowbite-svelte';
    import ModalCustomerIndividual
        from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/components/ModalCustomerIndividual/ModalCustomerIndividual.svelte";
    import CustomerIndividualListItem
        from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/components/CustomerIndividualListItem/CustomerIndividualListItem.svelte";
    import ModalCustomerBookingInformation
        from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/components/ModalCustomerBookingInformation/ModalCustomerBookingInformation.svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {
        CustomerBooking
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions.js";

    let customerBooking = CustomerBooking($now);
    let customerIndividualList = [[]];

    let selectedCustomerIndividualIndex = 0;
    let selectedCustomerIndividual = [];
    let modalCustomerIndividual = false;

    function openModalCustomerIndividual(index, customerIndividual)
    {
        selectedCustomerIndividualIndex = index;
        selectedCustomerIndividual = customerIndividual;
        modalCustomerIndividual = true;
    }

    function addCustomerIndividual() {
        customerIndividualList = [...customerIndividualList, []];
    }

    function removeCustomerIndividual(index) {
        if (index > -1 && index < customerIndividualList.length) {
            customerIndividualList = [
                ...customerIndividualList.slice(0, index),
                ...customerIndividualList.slice(index + 1)
            ];
        }
    }

    let modalCustomerBooking = false;

    function openModalCustomerBooking()
    {
        modalCustomerBooking = true;
    }

    let toastSuccess = false;
    let showToast = false;
    let toastColor = "green";
    let toastMessage = "";

    function triggerToast(success, color, message)
    {
        toastSuccess = success;
        toastColor = color;
        toastMessage = message;

        showToast = true;
        setTimeout(
            () => { showToast = false; }, 3000);
    }

    let overrideFlag = false;
    let sendSMS = false;

    async function submitCallback(success, error)
    {
        // Close the customer booking modal
        modalCustomerBooking = false;

        console.log(`submitCallback ${success} ${error}`);

        // Success
        let color = 'green';
        let message = "Booking successful!";

        // Error
        if (error)
        {
            color = 'red';
            message = "Something went wrong, please contact bookingwith.me";
        }
        else if (!success)
        {
            color = 'orange';
            message = "Booking time recently unavailable.";
        }

        console.log(`Here ${color} ${message}`)

        // Trigger to toast with close countdown
        triggerToast(success, color, message);
    }
</script>

<ul class="customer-list">
    {#each customerIndividualList as customerIndividual, index}
        <CustomerIndividualListItem
                {customerIndividual}
                {index}
                {openModalCustomerIndividual}
                {removeCustomerIndividual}
        />
    {/each}
</ul>

<Button on:click={addCustomerIndividual}>Add customer</Button>

<Button on:click={openModalCustomerBooking}>Submit</Button>

<!-- Modal for customer individual service selection -->
<ModalCustomerIndividual
        bind:open={modalCustomerIndividual}
        customerIndividualIndex={selectedCustomerIndividualIndex}
        customerIndividual={selectedCustomerIndividual}
/>

<!-- Modal for customer individual service selection -->
<ModalCustomerBookingInformation
        bind:open={modalCustomerBooking}
        bind:overrideFlag={overrideFlag}
        bind:sendSMS={sendSMS}
        {customerBooking}
        {customerIndividualList}
        {submitCallback}
/>


<!-- Toast for booking confirmation -->
<Toast bind:open={showToast} color={toastColor}>
    <svelte:fragment slot="icon">
        {#if toastSuccess}
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="green" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0z" clip-rule="evenodd"/></svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="red" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2z" clip-rule="evenodd"/></svg>
        {/if}
        <span class="sr-only">Icon</span>
    </svelte:fragment>
    {toastMessage}
</Toast>
