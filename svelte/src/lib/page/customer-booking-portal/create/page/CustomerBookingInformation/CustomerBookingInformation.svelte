<script>
    import {
        businessInfo,
        pageIndex,
        customerBooking,
        customerIndividualList
    } from "$lib/page/customer-booking-portal/create/stores/customer_booking_portal_create_store.js";
    import {sendTextBookingSuccess} from "$lib/api/api_twilio/api.js";
    import CustomerBookingInformation
        from "$lib/components/BookingComponents/CustomerBookingInformation/CustomerBookingInformation.svelte";

    function handlePrev()
    {
        // Go back to number of guests selector page
        pageIndex.set($pageIndex - 1);
    }

    async function submitCallback(success, error)
    {
        console.log("submitCallback()", $customerBooking, $customerIndividualList);

        if (success)
        {
            // Go to the success page
            pageIndex.set($pageIndex + 1);

            // Send SMS confirmation
            try
            {
                await sendTextBookingSuccess($businessInfo.businessName, response.customerBooking);
            }
            catch (error)
            {
                console.error(error);
            }
        }
        else if (error)
        {
            alert(`Something went wrong, please contact the business to make your appointment!`);
        }
        else
        {
            alert("Booking time recently unavailable. Please pick a different time!");
        }
    }
</script>

<CustomerBookingInformation
        businessId={$businessInfo.businessId}
        businessName={$businessInfo.businessName}
        handlePrev={handlePrev}
        handleSubmit={submitCallback}
        customerIndividualList={customerIndividualList}
        customerBooking={customerBooking}
/>
