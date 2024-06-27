<script>
    import CustomerBookingList
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingList.svelte";
    import {customerBookingQueueList} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
</script>

<div class="min-w-[348.4px] h-full bg-gray-100 rounded shadow p-4 overflow-y-auto border border-sky-200">
    <!-- List Header -->
    <div class="px-4 py-2 flex items-center justify-between select-none">
        <h2 class="text-lg font-bold">{"In Progress..."}</h2>
        <span class="text-sm">{$customerBookingQueueList[2].length}</span>
    </div>

    <CustomerBookingList
            customerBookingList={$customerBookingQueueList[2]}
    />
</div>
