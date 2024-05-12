<script>
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import {pageIndex} from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";
    import CustomerIndividualBooking
        from "$lib/components/BookingComponents/CustomerIndividualBooking/CustomerIndividualBooking.svelte";

    let currCustomer = 0;

    console.log("businessInfo", $businessInfo);
    export let selectedCustomerBooking;

    let customerIndividual = selectedCustomerBooking.customerIndividualBookingList[currCustomer].customerIndividualServiceBookingList;

    console.log("customerIndividual", customerIndividual)

    let guestSize = selectedCustomerBooking.customerIndividualBookingList.length;
    console.log("guest size is", guestSize);

    let submit = false;

    function handlePrev() {
        console.log("PREV CLICKED");
        if (currCustomer === 0) {
            //nothing rn
        } else {
            currCustomer--;
            customerIndividual = selectedCustomerBooking.customerIndividualBookingList[currCustomer].customerIndividualServiceBookingList;
        }
    }

    function handleNext() {
        console.log("NEXT CLICKED");
        console.log(currCustomer, "  ", currCustomer < (guestSize - 1));

        if (currCustomer < (guestSize - 1)) {
            console.log("next guest");
            currCustomer++;
            customerIndividual = selectedCustomerBooking.customerIndividualBookingList[currCustomer].customerIndividualServiceBookingList;
        } else {
            pageIndex.set($pageIndex + 1);
        }
    }

    console.log("selectedCustomerBooking", selectedCustomerBooking);
</script>
<!-- Modal for customer booking -->
<CustomerIndividualBooking
        handlePrev={handlePrev}
        handleNext={handleNext}
        bind:guestIndex={currCustomer}
        businessInfo={businessInfo}
        bind:customerIndividual={customerIndividual}
        disableOption={true}
/>

