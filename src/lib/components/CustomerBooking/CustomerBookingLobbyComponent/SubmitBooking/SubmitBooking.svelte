<script>
    import {Input, Label, Textarea} from "flowbite-svelte";
    import {formatPhoneNumber, rawPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        getCustomer
    } from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {
        pleaseFetchAvailability
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";
    import {submitCustomerBooking} from "$lib/api/api_server/functions.js";
    import {
        customerBookingLobbyComponent
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";

    export let customerBooking;
    export let submitSuccessful;
    export let options;

    // Phone number
    let formattedPhoneNumber = formatPhoneNumber(customerBooking.customer.phoneNumber);

    function handlePhoneNumberInput(event) {
        const input = event.target.value;

        // Update the raw customer phone number
        customerBooking.customer.phoneNumber = rawPhoneNumber(input);

        // Format as "(123) 456-7890"
        formattedPhoneNumber = formatPhoneNumber(input);

        // Fetch the customer profile
        // Only fetch it one time
        if (customerBooking.customer.phoneNumber.length === 10) {
            getCustomer($business.businessInfo.businessID, customerBooking.customer.phoneNumber)
                .then(customer => {
                    if (customer && customer.customerName) {
                        customerBooking.customer.customerName = customer.customerName;

                        console.log(`Autofilled customer name ${customer.customerName}`);
                    }
                })
                .catch(error => {
                    console.error('Failed to get customer:', error);
                });
        }
    }

    // Submit the customer booking
    function submit()
    {
        if ($customerBookingLobbyComponent.currentTimeString &&
            $customerBookingLobbyComponent.bookingDate &&
            $customerBookingLobbyComponent.selectedAvailability &&
            (customerBooking.customer.phoneNumber.length === 0 || customerBooking.customer.phoneNumber.length === 10))
        {
            const customerBookingInformationProps = {
                ...options,
                overrideFlag: $customerBookingLobbyComponent.selectedAvailability.override ?? false
            }

            submitCustomerBooking(
                customerBooking,
                $customerBookingLobbyComponent.bookingDate,
                $customerBookingLobbyComponent.currentTimeString,
                $customerBookingLobbyComponent.selectedAvailability.timePeriod.startTime,
                $customerBookingLobbyComponent.selectedAvailability.timePeriod,
                true,
                customerBookingInformationProps
            )
                .then(success => {
                    if (success)
                    {
                        // Show the successful page
                        submitSuccessful();
                    }
                    else
                    {
                        pleaseFetchAvailability();
                        alert("Booking time recently unavailable. Please pick a different time!");
                    }
                });
        }
        else
        {
            alert("Please select a booking time!");
        }
    }
</script>

<form id="bookingForm" on:submit|preventDefault={submit} class="space-y-4 h-full">
    <Label class="space-y-2">
        <span>Phone Number:</span>
        <Input
                id="phoneNumber"
                type="tel"
                placeholder="(123) 456-7890"
                bind:value={formattedPhoneNumber}
                on:input={handlePhoneNumberInput}
                pattern="^(\(\d{3}\) \d{3}-\d{4}?$"
                title="Phone number must be in the format: (123) 456-7890"
        />
    </Label>

    <Label class="space-y-2">
        <span>Name:</span>
        <Input
                id="customerName"
                bind:value={customerBooking.customer.customerName}
        />
    </Label>

    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->
    <!--A button to access to customer profile-->

    <!--The message attach to the customer booking-->
    <Label class="space-y-2">
        <span>Message:</span>
        <Textarea
                id="message"
                placeholder="Enter any message or note here..."
                rows="5"
                bind:value={customerBooking.message}
        />
    </Label>
</form>
