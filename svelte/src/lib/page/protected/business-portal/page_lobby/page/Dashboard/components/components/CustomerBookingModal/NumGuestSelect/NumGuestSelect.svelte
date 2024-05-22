<script>
    import {
        customerBooking,
        pageIndex
    } from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";
    import {
        CustomerIndividualBooking
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions/CustomerBooking.js";

    function handleNumGuestSubmit() {
        customerBooking.update(state => {
            const diff = Math.abs(state.customerIndividualBookingList.length - selectedNumGuests);

            if (selectedNumGuests < state.customerIndividualBookingList.length) {
                state.customerIndividualBookingList = state.customerIndividualBookingList.slice(0, state.customerIndividualBookingList.length - diff);
            } else if (selectedNumGuests > state.customerIndividualBookingList.length) {
                for (let i = 0; i < diff; i++) {
                    state.customerIndividualBookingList.push(CustomerIndividualBooking());
                }
            }

            console.log("selectedNumGuests", selectedNumGuests);
            console.log("customerIndividualBookingList", state.customerIndividualBookingList);

            return state;
        });

        // Go to the next page to get the customer individual booking information
        pageIndex.update(n => n + 1);
    }
</script>


