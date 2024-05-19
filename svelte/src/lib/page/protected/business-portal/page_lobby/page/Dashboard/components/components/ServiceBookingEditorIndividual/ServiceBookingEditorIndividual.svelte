<script>
    import {business} from "$lib/page/protected/stores/business.js";
    console.log($business);
    import {
        pageIndex,
        customerIndividualList
    } from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";
    import CustomerIndividualBooking
        from "$lib/components/BookingComponents/CustomerIndividualBooking/CustomerIndividualBooking.svelte";

    let guestIndex = 0;

    // Get the customer individual from the index
    let customerIndividual = [];
    $: if ($customerIndividualList && $customerIndividualList.length > guestIndex) {
        customerIndividual = $customerIndividualList[guestIndex];
        console.log("customerIndividual", customerIndividual);
        console.log("customerIndividualList", $customerIndividualList);
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
        if (guestIndex === ($customerIndividualList.length - 1)) {
            pageIndex.set($pageIndex + 1);
        }
        // Get the next customer
        else {
            guestIndex += 1;
        }
    }
</script>

<!-- Modal for customer booking -->
<CustomerIndividualBooking
        handlePrev={handlePrev}
        handleNext={handleNext}
        bind:guestIndex={guestIndex}
        business={business}
        bind:customerIndividual={customerIndividual}
/>

