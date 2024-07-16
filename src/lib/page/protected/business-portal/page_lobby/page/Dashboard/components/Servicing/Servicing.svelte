<script>
    import CustomerBookingList
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingList.svelte";

    export let flipDurationMs;
    export let customerBookingQueueList;
    export let dragDisabled;
    export let moveFinished;
    export let droppedIntoID;
    export let progress;

</script>


<!-- List Header -->
<div class="flex-none px-4 py-2 flex items-center justify-between select-none">
    <h2 class="text-lg font-bold">{"In Progress..."}</h2>
    <span class="text-sm">{customerBookingQueueList[2].length}</span>
</div>

<CustomerBookingList bind:progress={progress} bind:droppedIntoID={droppedIntoID} flipDurationMs={flipDurationMs} bind:moveFinished={moveFinished} bind:dragDisabled={dragDisabled} columnID={2} customerBookingList={customerBookingQueueList[2]}/>
