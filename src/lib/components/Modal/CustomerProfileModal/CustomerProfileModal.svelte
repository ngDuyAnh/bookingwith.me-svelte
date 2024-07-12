<script>
    import {Modal} from "flowbite-svelte";
    import {customerProfileModal} from "$lib/components/Modal/CustomerProfileModal/customerProfileModal.js";
    import CustomerProfile from "$lib/components/Form/CustomerProfile/CustomerProfile.svelte";
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$customerProfileModal.open} size="md" outsideclose
           bodyClass="p-4 md:p-5 space-y-0 flex-1 overflow-y-auto overscroll-contain"
           class="w-full max-w-3xl h-[80vh] border-8"
           classBackdrop="fixed inset-0 z-50 bg-gray-900 bg-opacity-90 dark:bg-opacity-80"
    >
        <svelte:fragment slot="header">
            <h1 class="select-none text-2xl text-gray-700 font-bold">
                Customer Profile
            </h1>
        </svelte:fragment>

        <CustomerProfile
                bind:customerProfile={$customerProfileModal.customerProfile}
        />
    </Modal>
</div>
