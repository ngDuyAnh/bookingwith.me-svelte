<!--
<script>
    import {business} from "$lib/page/protected/stores/business.js";
    console.log($business);
    import {customerBooking,
        pageIndex,
        customerIndividualList
    } from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";
    import CustomerIndividualBooking
        from "$lib/components/BookingComponents/CustomerIndividualBooking/CustomerIndividualBooking.svelte";

    let guestIndex = 0;

    // Get the customer individual from the index
    let customerIndividual = [];
    $: if ($customerBooking.customerIndividualBookingList && $customerBooking.customerIndividualBookingList.length > guestIndex) {
        customerIndividual = $customerBooking.customerIndividualBookingList[guestIndex];
        console.log("customerIndividual", customerIndividual);
        console.log("customerIndividualList", $customerBooking.customerIndividualBookingList);
    }

    function handlePrev() {
        // Go back to number of guests selector page
        if (guestIndex === 0) {
            pageIndex.set($pageIndex - 1);
        }
        // Go back to the previous customer
        else {
            guestIndex -= 1;
        }
    }

    function handleNext() {
        // Go to the next page to get the customer booking information
        if (guestIndex === ($customerBooking.customerIndividualBookingList.length - 1)) {
            pageIndex.set($pageIndex + 1);
        }
        // Get the next customer
        else {
            guestIndex += 1;
        }
    }
</script>

&lt;!&ndash; Modal for customer booking &ndash;&gt;
<CustomerIndividualBooking
        handlePrev={handlePrev}
        handleNext={handleNext}
        bind:guestIndex={guestIndex}
        business={business}
        bind:customerIndividual={customerIndividual}
/>

-->
