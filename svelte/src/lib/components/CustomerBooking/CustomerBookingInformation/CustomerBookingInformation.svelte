<script>
    import {Button, Toggle, Tooltip} from "flowbite-svelte";
    import CustomerBookingInformationForm
        from "$lib/components/Form/CustomerBookingInformationForm/CustomerBookingInformationForm.svelte";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {ArrowLeftOutline} from 'flowbite-svelte-icons';

    export let preselectForWalkin = false;

    export let showCustomerBookingInformationOptionHeader;
    export let customerBookingInformationProps;

    export let customerBookingInformationFormProps;

    export let business;
    export let customerBooking;
    export let gotoCustomerIndividualBookingServiceSelect;
    export let gotoBookingSuccess;

    function handlePrev() {
        gotoCustomerIndividualBookingServiceSelect();
    }

    function submitCallback(success, error) {
        console.log("submitCallback()", customerBooking);

        if (success) {
            // Go to the success page
            gotoBookingSuccess();
        } else if (error) {
            alert(`Something went wrong, please contact the business at ${formatPhoneNumber(business.businessInfo.businessPhoneNumber)} to make your appointment!`);
        } else {
            alert("Booking time recently unavailable. Please pick a different time!");
        }
    }
</script>

<div class="flex flex-col items-center">
    <div class="flex justify-between items-center px-4 pt-4 w-full">
        <Button class="!p-2" on:click={handlePrev} pill={true}>
            <ArrowLeftOutline class="w-6 h-6"/>
        </Button>
    </div>

    <h3 class="text-2xl font-medium text-gray-900 dark:text-white">Booking information</h3>

    <div class="mt-4 flex flex-wrap justify-center items-center w-full space-x-1">
        {#if customerBookingInformationProps.showOverride}
            <div id="show-override-tooltip" class="flex items-center">
                <Toggle bind:checked={customerBookingInformationProps.overrideFlag} class="toggle">Override
                </Toggle>
                <Tooltip triggeredBy="#show-override-tooltip">Override booking time</Tooltip>
            </div>
        {/if}

        {#if customerBookingInformationProps.showSendSms}
            <div id="show-sms-tooltip" class="flex items-center ml-1">
                <Toggle bind:checked={customerBookingInformationProps.sendSmsFlag} class="toggle">SMS</Toggle>
                <Tooltip triggeredBy="#show-sms-tooltip">Notify customer through SMS</Tooltip>
            </div>
        {/if}

        {#if customerBookingInformationProps.showLobbyBookingState}
            <div id="show-sms-tooltip" class="flex items-center ml-1">
                <Toggle bind:checked={customerBookingInformationProps.lobbyBookingStateFlag} class="toggle">
                    Lobby
                </Toggle>
                <Tooltip triggeredBy="#show-sms-tooltip">Move appointment to lobby</Tooltip>
            </div>
        {/if}
    </div>


    <!-- Customer booking information -->
    <div class="w-full max-w-md p-8">
        <CustomerBookingInformationForm
                businessInfo={business.businessInfo}

                customerBooking={customerBooking}

                {customerBookingInformationFormProps}
                {customerBookingInformationProps}
                {preselectForWalkin}

                {submitCallback}
        />
    </div>
</div>