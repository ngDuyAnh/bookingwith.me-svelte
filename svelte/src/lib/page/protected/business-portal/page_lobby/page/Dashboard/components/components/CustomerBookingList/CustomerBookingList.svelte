<script>
    import CustomerBookingListItem
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingListItem/CustomerBookingListItem.svelte";
    import {
        handleCustomerBookingClick
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";

    export let customerBookingList;
</script>

<!-- List -->
<ul>
    {#each customerBookingList as customerBooking (customerBooking.id)}
        <li class="border-b last:border-b-0">
            <button
                    class="mb-4 p-4 bg-white rounded shadow select-none w-full text-left
                        hover:bg-gray-300 transition-all duration-300 ease-in-out"
                        on:click={() => handleCustomerBookingClick(customerBooking)}
            >
                <CustomerBookingListItem {customerBooking} />
            </button>
        </li>
    {/each}
</ul>
