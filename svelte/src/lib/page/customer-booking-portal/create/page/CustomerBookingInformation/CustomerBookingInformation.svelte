<script>
    import {
        businessInfo,
        pageIndex,
        customerBooking,
        customerIndividualList
    } from "$lib/page/customer-booking-portal/create/stores/customer_booking_portal_store.js";
    import CustomerBookingInformationForm
        from "$lib/components/Form/CustomerBookingInformationForm/CustomerBookingInformationForm.svelte";
    import {
        CustomerBookingState
    } from "$lib/api/api_server/customer-booking-portal/initialize_functions.js";
    import {submitBooking} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {sendTextBookingSuccess} from "$lib/api/api_twilio/api.js";

    function handlePrev()
    {
        // Go back to number of guests selector page
        pageIndex.set($pageIndex - 1);
    }

    async function handleSubmit()
    {
        console.log("handleSubmit()", $customerBooking, $customerIndividualList);

        try
        {
            // Initialize the customer booking as appointment which is index 0
            $customerBooking.bookingState = CustomerBookingState.APPOINTMENT;

            // Force submit if override is toggled
            let response = await submitBooking(
                $businessInfo.businessId,
                $customerBooking,
                $customerIndividualList
            );

            // Submitted
            if (response.submitted)
            {
                customerBooking.set(response.customerBooking);

                // Go to the success page
                pageIndex.set($pageIndex + 1);

                // Send SMS confirmation
                try
                {
                    await sendTextBookingSuccess($businessInfo.businessName, $customerBooking)
                }
                catch (error)
                {
                    console.error(error)
                }
            }
            // Appointment recently taken
            else
            {
                alert("Booking time recently unavailable. Please pick a different time!");
            }
        }
        catch (error)
        {
            console.error("Error submitting booking:", error);
        }
    }
</script>

<div class="flex flex-col items-center min-h-screen">
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

    <!-- Customer booking information -->
    <div class="mt-3 w-full max-w-md p-8 border-2 border-gray-200 shadow-md rounded-lg">
        <CustomerBookingInformationForm
                   businessId={$businessInfo.businessId}
                   customerBooking={$customerBooking}
                   customerIndividualList={$customerIndividualList}
                   submit={handleSubmit}
        />
    </div>
</div>
