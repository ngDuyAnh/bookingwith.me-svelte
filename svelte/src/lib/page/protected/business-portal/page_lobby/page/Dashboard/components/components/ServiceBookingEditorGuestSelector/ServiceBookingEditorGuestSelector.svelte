<script>
    import {Spinner} from "flowbite-svelte";
    import GuestSelect from "$lib/components/BookingComponents/GuestSelect/GuestSelect.svelte";
    import {business} from "$lib/page/protected/stores/business.js";

    console.log($business);
    import {customerBooking,
        customerIndividualList,
        pageIndex
    } from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";
    import {onMount} from "svelte";
    import {
        CustomerIndividualBooking, CustomerIndividualServiceBooking
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions/CustomerBooking.js";

    let selectedNumGuests;

    // Wait for the business.businessInfo fetching to be done
    let loading = true;
    $: if ($business.businessInfo) {
        loading = false;
    }

    function handleSubmit() {
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

    onMount(() => {

        selectedNumGuests = $customerBooking.customerIndividualBookingList.length;

        console.log("selectedNumGuests", selectedNumGuests);
        console.log("$customerIndividualList", $customerBooking.customerIndividualBookingList);
    });
</script>
<div class="flex justify-center items-center h-[85%]">
    {#if loading}
        <Spinner/>
    {:else}
        <GuestSelect
                businessInfo={$business.businessInfo}
                handleSubmit={handleSubmit}
                bind:selectedNumGuests={selectedNumGuests}
        />
    {/if}
</div>