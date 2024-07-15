<script>
    import {Button, Toggle, Tooltip} from "flowbite-svelte";
    import CustomerBookingInformationForm
        from "$lib/components/Form/CustomerBookingInformationForm/CustomerBookingInformationForm.svelte";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {ArrowLeftOutline} from 'flowbite-svelte-icons';
    import {isToday} from "$lib/page/stores/now/now_dayjs_store.js";

    export let customerBookingInformationProps;

    export let customerBookingInformationFormProps;

    export let business;
    export let customerBooking;
    export let gotoCustomerIndividualBookingServiceSelect;
    export let gotoBookingSuccess;

    function handlePrev() {
        gotoCustomerIndividualBookingServiceSelect();
    }

    function submitCallback(success) {
        console.log("submitCallback()", customerBooking);

        if (success) {
            // Go to the success page
            gotoBookingSuccess();
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

    <div class="mt-4 flex flex-wrap justify-center items-center w-full space-x-4">
        {#if customerBookingInformationProps.showOverride}
            <div class="flex items-center">
                <Toggle bind:checked={customerBookingInformationProps.overrideFlag}>Override
                </Toggle>
                <Tooltip>Override booking time</Tooltip>
            </div>
        {/if}

        {#if customerBookingInformationProps.showSendSms}
            <div class="flex items-center">
                <Toggle bind:checked={customerBookingInformationProps.sendSmsFlag} class="toggle">SMS</Toggle>
                <Tooltip>Notify customer through SMS</Tooltip>
            </div>
        {/if}

        {#if customerBookingInformationProps.showAppointmentBookingState}
            <div class="flex items-center {isToday(customerBooking.bookingDate) ? '' : 'hidden'}">
                <Toggle
                        bind:checked={customerBookingInformationProps.appointmentBookingStateFlag}>
                    Appointment
                </Toggle>
                <Tooltip>Move booking to appointment</Tooltip>
            </div>
        {/if}

        {#if customerBookingInformationProps.showLobbyBookingState}
            <div class="flex items-center {isToday(customerBooking.bookingDate) ? '' : 'hidden'}">
                <Toggle
                        bind:checked={customerBookingInformationProps.lobbyBookingStateFlag}>
                    Lobby
                </Toggle>
                <Tooltip>Move booking to lobby</Tooltip>
            </div>
        {/if}
    </div>

    <!-- Customer booking information -->
    <div class="w-full max-w-md p-8">
        <CustomerBookingInformationForm
                businessInfo={business.businessInfo}

                bind:customerBooking={customerBooking}

                {customerBookingInformationFormProps}
                {customerBookingInformationProps}

                {submitCallback}
        />
    </div>
</div>