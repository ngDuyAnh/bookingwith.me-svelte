<script>
    import {Toggle, Tooltip} from "flowbite-svelte";
    import CustomerBookingInformationForm
        from "$lib/components/Form/CustomerBookingInformationForm/CustomerBookingInformationForm.svelte";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import { Button } from 'flowbite-svelte';
    import { ArrowLeftOutline } from 'flowbite-svelte-icons';

    export let showCustomerBookingInformationOptionHeader = false;
    export let customerBookingInformationFormProps = {
        customerNameAutoComplete: false,
        requiredAgreeToReceiveSMS: true
    };

    export let business;
    export let customerBooking;
    export let gotoCustomerIndividualBookingServiceSelect;
    export let gotoBookingSuccess;

    export let overrideFlag = false;
    export let sendSMSFlag = true;

    export let preselectForWalkin = false;

    function handlePrev()
    {
        gotoCustomerIndividualBookingServiceSelect();
    }

    function submitCallback(success, error)
    {
        console.log("submitCallback()", customerBooking);

        if (success)
        {
            // Go to the success page
            gotoBookingSuccess();
        }
        else if (error)
        {
            alert(`Something went wrong, please contact the business at ${formatPhoneNumber(business.businessInfo.businessPhoneNumber)} to make your appointment!`);
        }
        else
        {
            alert("Booking time recently unavailable. Please pick a different time!");
        }
    }
</script>

<div class="flex flex-col items-center">
    <div class="flex justify-between items-center px-4 pt-4 w-full">
        <Button pill={true} on:click={handlePrev} class="!p-2"><ArrowLeftOutline class="w-6 h-6" /></Button>
    </div>

    <div class="max-w-md mb-1">
        <h3 class="text-2xl font-medium text-gray-900 dark:text-white">Booking information</h3>

        {#if showCustomerBookingInformationOptionHeader}
            <div class="mt-4 flex justify-between flex-row md:items-center md:space-x-2">
                <div id="show-override-tooltip" class="flex items-center mb-1 md:mb-0">
                    <Toggle  bind:checked={overrideFlag} class="toggle">Override</Toggle>
                    <Tooltip triggeredBy="#show-override-tooltip">Override booking time</Tooltip>
                </div>
                <div id="show-sms-tooltip" class="flex items-center">
                    <Toggle   bind:checked={sendSMSFlag} class="toggle">SMS</Toggle>
                    <Tooltip triggeredBy="#show-sms-tooltip">Notify customer through SMS</Tooltip>
                </div>
            </div>
        {/if}
    </div>

    <!-- Customer booking information -->
    <div class="w-full max-w-md p-8">
        <CustomerBookingInformationForm
                {...customerBookingInformationFormProps}

                businessInfo={business.businessInfo}
                customerBooking={customerBooking}
                {submitCallback}

                {overrideFlag}
                {sendSMSFlag}

                walkinAvailabilityFlag={preselectForWalkin}
                {preselectForWalkin}
        />
    </div>
</div>
