<script>
    import CustomerBookingList
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingList.svelte";
    import {bookingStateList} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {getContext} from "svelte";

    // Customer booking click
    const handleCustomerBookingClick = getContext('handleCustomerBookingClick');
</script>

<div class="min-w-[348.4px] max-w-[348.4px] bg-gray-100 rounded shadow p-4 overflow-y-auto border border-sky-200">
    <!-- List Header -->
    <div class="px-4 py-2 flex items-center justify-between select-none">
        <h2 class="text-lg font-bold">{"Completed"}</h2>
        <span class="text-sm">{$bookingStateList[3].length}</span>
    </div>

    <CustomerBookingList
            customerBookingList={$bookingStateList[3]}
            {handleCustomerBookingClick}
    />
</div>
