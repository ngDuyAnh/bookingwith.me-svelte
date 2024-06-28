<script>
    import NumGuestSelect from "$lib/components/CustomerBooking/NumGuestSelect/NumGuestSelect.svelte";
    import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import CustomerIndividualBookingServiceSelect
        from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/CustomerIndividualBookingServiceSelect.svelte";
    import CustomerBookingInformation
        from "$lib/components/CustomerBooking/CustomerBookingInformation/CustomerBookingInformation.svelte";
    import BookingSuccess from "$lib/components/CustomerBooking/BookingSuccess/BookingSuccess.svelte";

    export let customerIndividualBookingServiceSelectProps = {
        showAllServiceGroup: false,
        showAllService: false,
        showAllEmployeeSelectOptions: false
    };

    export let customerBookingInformationProps = {
        showOverride: false,
        showSendSms: false,
        showLobbyBookingState: false,

        overrideFlag: false,
        sendSmsFlag: true,
        lobbyBookingStateFlag: false,
    };

    export let customerBookingInformationFormProps = {
        customerNameAutoComplete: false,
        requiredAgreeToReceiveSMS: true
    };

    export let business;

    export let customerBooking = {
        ...CustomerBooking(),
        customerIndividualBookingList: [CustomerIndividualBooking()]
    };

    // Initialize the booking channel
    export let bookingChannel;
    $: if (customerBooking.bookingChannel === -1) {
        customerBooking.bookingChannel = bookingChannel;
    }

    let pageIndex = 0;
    let guestIndex = 0;

    function gotoNumGuestSelect() {
        pageIndex = 0;
    }

    function gotoCustomerIndividualBookingServiceSelect(numGuest)
    {
        // Adjust the number of guests, individual booking
        let currentLength = customerBooking.customerIndividualBookingList.length;
        if (numGuest < currentLength) {
            customerBooking.customerIndividualBookingList = customerBooking.customerIndividualBookingList.slice(0, numGuest);
        } else if (numGuest > currentLength) {
            for (let i = 0; i < numGuest - currentLength; i++) {
                customerBooking.customerIndividualBookingList.push(CustomerIndividualBooking());
            }
        }

        // Go to the customer individual service select page
        pageIndex = 1;
    }

    function gotoCustomerBookingInformation() {
        pageIndex = 2;
    }

    function gotoBookingSuccess() {
        pageIndex = 3;
    }

</script>

<div class="h-full w-full overflow-auto">
    {#if pageIndex === 0}
        <NumGuestSelect
                businessInfo={business.businessInfo}
                {gotoCustomerIndividualBookingServiceSelect}
                selectedNumGuests={customerBooking.customerIndividualBookingList.length}
        />
    {:else if pageIndex === 1}
        <CustomerIndividualBookingServiceSelect
                {business}
                {gotoNumGuestSelect}
                {gotoCustomerBookingInformation}
                customerIndividualBookingList={customerBooking.customerIndividualBookingList}

                bind:guestIndex={guestIndex}

                {customerIndividualBookingServiceSelectProps}
        />
    {:else if pageIndex === 2}
        <CustomerBookingInformation
                {customerBookingInformationProps}

                {customerBookingInformationFormProps}

                {business}
                {customerBooking}
                {gotoCustomerIndividualBookingServiceSelect}
                {gotoBookingSuccess}
        />
    {:else if pageIndex === 3}
        <BookingSuccess/>
    {/if}
</div>
