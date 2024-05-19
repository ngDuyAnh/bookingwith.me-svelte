<script>
    import CustomerBookingListItem
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingListItem/CustomerBookingListItem.svelte";

    export let listName;
    export let customerBookingList;
    export let handleCustomerBookingClick;
</script>

<div class="min-w-[348.4px] max-w-[348.4px] h-full bg-gray-100 rounded shadow p-4 overflow-y-auto border border-sky-200">
    <!-- List Header -->
    <div class="px-4 py-2 flex items-center justify-between select-none">
        <h2 class="text-lg font-bold">{listName}</h2>
        <span class="text-sm">{customerBookingList.length}</span>
    </div>

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
</div>
