<script>
    import {Toggle} from "flowbite-svelte";
    import CustomerBookingInformationForm
        from "$lib/components/Form/CustomerBookingInformationForm/CustomerBookingInformationForm.svelte";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";

    export let showCustomerBookingInformationFlagHeader = false;
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
        <button
                class="flex items-center justify-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 ease-in-out"
                on:click={handlePrev}
                aria-label="Previous"
        >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
            </svg>
        </button>
    </div>

    <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">Booking information</h3>

        {#if showCustomerBookingInformationFlagHeader}
            <div class="flex items-center space-x-2">
                <Toggle bind:checked={overrideFlag} class="toggle">Override</Toggle>
                <Toggle bind:checked={sendSMSFlag} class="toggle">SMS</Toggle>
            </div>
        {/if}
    </div>

    <!-- Customer booking information -->
    <div class="mt-3 w-full max-w-md p-8 border-2 border-gray-200 shadow-md rounded-lg">
        <CustomerBookingInformationForm
                {...customerBookingInformationFormProps}

                businessInfo={business.businessInfo}
                customerBooking={customerBooking}
                {submitCallback}

                {overrideFlag}
                {sendSMSFlag}
        />
    </div>
</div>
