<!--
<script>
    import {
        customerIndividualList,
        pageIndex
    } from "$lib/page/customer-booking-portal/create/stores/customer_booking_portal_create_store.js";
    import {businessInfo} from "$lib/page/customer-booking-portal/create/stores/customer_booking_portal_create_store.js";
    import CustomerIndividualBooking from "$lib/components/BookingComponents/CustomerIndividualBooking/CustomerIndividualBooking.svelte";

    let guestIndex = 0;

    // Get the customer individual from the index
    let customerIndividual = [];
    $: if ($customerIndividualList && $customerIndividualList.length > guestIndex) {
        customerIndividual = $customerIndividualList[guestIndex];
        console.log("customerIndividual",customerIndividual);
        console.log("customerIndividualList",$customerIndividualList);
    }

    function handlePrev()
    {
        // Go back to number of guests selector page
        if (guestIndex === 0)
        {
            pageIndex.set($pageIndex - 1);
        }
        // Go back to the previous customer
        else
        {
            guestIndex -= 1;
        }
    }

    function handleNext()
    {
        // Go to the next page to get the customer booking information
        if (guestIndex === ($customerIndividualList.length - 1))
        {
            pageIndex.set($pageIndex + 1);
        }
        // Get the next customer
        else
        {
            guestIndex += 1;
        }
    }
</script>

<CustomerIndividualBooking
    handlePrev={handlePrev}
    handleNext={handleNext}
    bind:guestIndex={guestIndex}
    businessInfo={businessInfo}
    bind:customerIndividual={customerIndividual}
/>-->
