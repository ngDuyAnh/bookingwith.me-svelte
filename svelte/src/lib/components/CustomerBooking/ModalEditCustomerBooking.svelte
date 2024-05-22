<script>
    import {Modal} from "flowbite-svelte";
    import CustomerBooking from "$lib/components/CustomerBooking/CustomerBooking.svelte";

    export let open = false;

    export let business;
    export let customerBooking;
</script>

<Modal bind:open={open} size="md" class="w-full max-w-3xl h-[80vh] border-dotted border-8" classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80"  outsideclose>
    <CustomerBooking
            {business}
            {customerBooking}
    />
</Modal>
