<script>
    import {pageIndex} from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";
    import {Modal} from "flowbite-svelte";
    import ServiceBookingEditorIndividual
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/ServiceBookingEditorIndividual/ServiceBookingEditorIndividual.svelte";
    import ServiceBookingEditorSubmission
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/ServiceBookingEditorSubmission/ServiceBookingEditorSubmission.svelte";
    import ServiceBookingEditorGuestSelector
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/ServiceBookingEditorGuestSelector/ServiceBookingEditorGuestSelector.svelte";

    export let open;

</script>

<Modal bind:open={open} size="" class="w-full max-w-3xl h-[80vh] border-8" classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80" outsideclose>
    {#if $pageIndex === 0}
        <ServiceBookingEditorGuestSelector/>
    {:else if $pageIndex === 1}
        <ServiceBookingEditorIndividual/>
    {:else if $pageIndex === 2}
        <ServiceBookingEditorSubmission/>
    {/if}
</Modal>
