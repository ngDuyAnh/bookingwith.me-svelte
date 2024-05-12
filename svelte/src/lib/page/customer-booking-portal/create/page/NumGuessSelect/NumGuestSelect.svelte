<script>
    import {
        businessInfo,
        customerIndividualList,
        pageIndex
    } from "$lib/page/customer-booking-portal/create/stores/customer_booking_portal_create_store.js";
    import {Spinner} from "flowbite-svelte";
    import GuestSelect from "$lib/components/BookingComponents/GuestSelect/GuestSelect.svelte";

    let selectedNumGuests = $customerIndividualList.length;

    // Wait for the businessInfo fetching to be done
    let loading = true;
    $: if ($businessInfo) {
        loading = false;
    }

    function handleSubmit() {
        // Update the customer individual list
        let diff = Math.abs($customerIndividualList.length - selectedNumGuests);
        if (selectedNumGuests < $customerIndividualList.length) {
            customerIndividualList.update(list => {
                return list.slice(0, list.length - diff);
            });
        } else if (selectedNumGuests > $customerIndividualList.length) {
            customerIndividualList.update(list => {
                for (let i = 0; i < diff; i++) {
                    list.push([]);
                }
                return list;
            });
        }

        // Go to the next page to get the customer individual booking information
        pageIndex.set($pageIndex + 1);
    }
</script>


<div class="flex justify-center items-center h-screen">
    {#if loading}
        <Spinner/>
    {:else}
        <GuestSelect
                businessInfo={$businessInfo}
                handleSubmit={handleSubmit}
                bind:selectedNumGuests={selectedNumGuests}
        />
    {/if}
</div>




