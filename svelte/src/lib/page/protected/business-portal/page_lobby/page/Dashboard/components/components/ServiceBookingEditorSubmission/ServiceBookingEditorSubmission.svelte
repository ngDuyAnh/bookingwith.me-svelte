<script>
    import CustomerBookingInformationForm
        from "$lib/components/Form/CustomerBookingInformationForm/CustomerBookingInformationForm.svelte";
    import {
        CustomerBookingState
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions.js";

    import {submitBooking} from "$lib/api/api_server/customer-booking-portal/api.js";
    import {sendTextBookingSuccess} from "$lib/api/api_twilio/api.js";

    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import CustomerBookingInformation
        from "$lib/components/BookingComponents/CustomerBookingInformation/CustomerBookingInformation.svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {pageIndex,customerIndividualList,customerBooking} from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";


    console.log("customerBooking",customerBooking)
    console.log("customerIndividualList",customerIndividualList)
    // console.log("CustomerBookingInformationForm")
    console.log("CustomerBookingState",CustomerBookingState)
    // console.log("customerBooking")
    // console.log("customerBooking")


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
                $now.format(),
                $customerIndividualList
            );

            // Submitted
            if (response.submitted)
            {
                // Go to the success page
                pageIndex.set(0);
                alert("SUBMITTED THE EDIT");

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


<CustomerBookingInformation
        businessInfo={businessInfo}
        handlePrev={handlePrev}
        handleSubmit={handleSubmit}
        customerBooking={customerBooking}
        customerIndividualList={customerIndividualList}
/>
