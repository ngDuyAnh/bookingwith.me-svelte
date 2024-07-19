<script>
    import {Button, Checkbox, Input, Label, Modal} from "flowbite-svelte";
    import {
        serviceGroupModal,
        handleSaveServiceGroupModal,
        handleDeleteServiceGroupModal
    } from "$lib/components/Modal/ServiceGroupModal/stores/serviceGroupModal.js";
</script>

<Modal bind:open={$serviceGroupModal.open} size="xs" outsideclose>
    <form
            class="flex flex-col space-y-2"
            on:submit|preventDefault={handleSaveServiceGroupModal}
    >
        {#if $serviceGroupModal.createServiceGroupFlag}
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create service group</h3>
        {:else}
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit service group</h3>
        {/if}

        <Label>
            <span>Service Group Name</span>
            <Input bind:value={$serviceGroupModal.serviceGroup.serviceGroupName} required />
        </Label>

        <Label>
            <span>Description</span>
            <Input bind:value={$serviceGroupModal.serviceGroup.description} required />
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox bind:checked={$serviceGroupModal.serviceGroup.multiselect}>
                Multiselect
            </Checkbox>
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox bind:checked={$serviceGroupModal.serviceGroup.showOnlineBookingPage}>
                Show on online booking page
            </Checkbox>
        </Label>

        {#if $serviceGroupModal.createServiceGroupFlag}
            <Button
                    class="w-full"
                    type="submit"
            >
                Add
            </Button>
        {:else}
            <Button
                    class="w-full"
                    type="submit"
            >
                Save
            </Button>
            <Button class="w-full" on:click={handleDeleteServiceGroupModal}>Delete</Button>
        {/if}
    </form>
</Modal>
