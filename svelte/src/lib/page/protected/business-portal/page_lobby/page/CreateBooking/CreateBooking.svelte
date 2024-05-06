<script>
    import {Button, Toast} from 'flowbite-svelte';
    import ModalCustomerIndividual
        from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/components/ModalCustomerIndividual/ModalCustomerIndividual.svelte";
    import CustomerIndividualListItem
        from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/components/CustomerIndividualListItem/CustomerIndividualListItem.svelte";
    import ModalCustomerBookingInformation
        from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/components/ModalCustomerBookingInformation/ModalCustomerBookingInformation.svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {CustomerBookingState, CustomerBooking} from "$lib/api/api_server/customer-booking-portal/initialize_functions.js";
    import {forceSubmitBooking, submitBooking} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import {CheckCircleSolid, ExclamationCircleSolid} from "flowbite-svelte-icons";
    import {sendTextBookingSuccess} from "$lib/api/api_twilio/api.js";

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

    let showToast = false;
    let toastIcon = CheckCircleSolid;
    let toastColor = "green";
    let toastMessage = "";

    function triggerToast() {
        showToast = true;
        setTimeout(
            () => { showToast = false; }, 3000);
    }

    let overrideFlag = false;
    let sendSMS = true;
    async function submit()
    {
        console.log("submit()", customerBooking, customerIndividualList);

        // Close the customer booking modal
        modalCustomerBooking = false;

        try
        {
            // Initialize the customer booking as appointment which is index 0
            customerBooking.bookingState = CustomerBookingState.APPOINTMENT;

            // Force submit if override is toggled
            let response = {};
            if (overrideFlag)
            {
                response = await forceSubmitBooking(
                    $businessInfo.business.businessId,
                    customerBooking,
                    $now.format(),
                    customerIndividualList
                );
            }
            else
            {
                response = await submitBooking(
                    $businessInfo.business.businessId,
                    customerBooking,
                    $now.format(),
                    customerIndividualList
                );
            }

            // Submitted
            if (response.submitted)
            {
                // Send SMS
                if (sendSMS)
                {
                    try
                    {
                        await sendTextBookingSuccess($businessInfo.businessName, response.customerBooking);
                    }
                    catch (error)
                    {
                        console.error(error);
                    }
                }

                // For display success submit
                toastIcon = CheckCircleSolid;
                toastColor = 'green';
                toastMessage = "Booking successful!";

                // Reinitialize to default
                customerBooking = CustomerBooking($now);
                customerIndividualList = [[]];
            }
            else
            {
                toastIcon = ExclamationCircleSolid;
                toastColor = 'orange';
                toastMessage = "Booking time recently unavailable.";
            }

            // Trigger to toast with close countdown
            triggerToast();
        }
        catch (error)
        {
            console.error("Error submitting booking:", error);
            toastIcon = ExclamationCircleSolid;
            toastColor = 'red';
            toastMessage = "Something went wrong, please contact bookingwith.me";
        }
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
        {submit}
/>

<!-- Toast for booking confirmation -->
<Toast bind:open={showToast} color={toastColor}>
    <svelte:fragment slot="icon">
        <svelte:component this={toastIcon} class="w-5 h-5" />
        <span class="sr-only">Icon</span>
    </svelte:fragment>
    {toastMessage}
</Toast>
