<script>
    import {
        CustomerBookingState
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions/CustomerBooking.js";
    import {sendTextBookingSuccess} from "$lib/api/api_twilio/api.js";

    import {business} from "$lib/page/protected/stores/business.js";
    console.log($business);
    import CustomerBookingInformation
        from "$lib/components/BookingComponents/CustomerBookingInformation/CustomerBookingInformation.svelte";
    import {pageIndex,customerIndividualList,customerBooking} from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";

    // console.log("customerBooking",customerBooking)
    // console.log("customerIndividualList",customerIndividualList)
    // console.log("CustomerBookingInformationForm")
    // console.log("CustomerBookingState",CustomerBookingState)
    // console.log("customerBooking")
    // console.log("customerBooking")


    function handlePrev()
    {
        // Go back to number of guests selector page
        pageIndex.set($pageIndex - 1);
    }

    async function submitCallback(success, error)
    {
        console.log("submitCallback()", $customerBooking, $customerBooking.customerIndividualList);

        if (success)
        {
            // Go to the success page
            pageIndex.set($pageIndex + 1);

            // Send SMS confirmation
            try
            {
                await sendTextBookingSuccess($business.businessInfo.businessName, response.customerBooking);
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
        businessId={$business.businessInfo.businessID}
        businessName={$business.businessInfo.businessName}
        handlePrev={handlePrev}
        handleSubmit={submitCallback}
        customerBooking={customerBooking}
        customerIndividualList={$customerBooking.customerIndividualBookingList}
/>

