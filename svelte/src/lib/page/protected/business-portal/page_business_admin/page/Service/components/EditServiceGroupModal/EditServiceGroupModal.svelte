<script>
    import {Button, Checkbox, Input, Label, Modal} from "flowbite-svelte";
    import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import {business} from "$lib/page/stores/business/business.js";

    export let open = false;
    export let editingServiceGroup;

    // Cloned on open
    let serviceGroup = {};
    let wasOpen = open;
    $: if (open && !wasOpen) {
        wasOpen = true;
        serviceGroup = JSON.parse(JSON.stringify(editingServiceGroup));
    } else if (!open) {
        wasOpen = false;
        serviceGroup = {};
    }

    async function handleEditServiceGroup() {
        console.log('Updating service group with new details:', serviceGroup);

        // Deep clone
        Object.assign(editingServiceGroup, serviceGroup);

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Close the modal and reset the fields
        open = false;
        serviceGroup = {};
    }

    async function handleDeleteServiceGroup()
    {
        console.log('Deleting service group:', editingServiceGroup);

        // Confirm deletion
        if (!confirm('Are you sure you want to delete this service group?')) {
            return;
        }

        // Archive
        editingServiceGroup.archive = true;

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Close the modal and reset the fields
        open = false;
        serviceGroup = {};
    }
</script>

<Modal bind:open={open} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-2" on:submit|preventDefault={() => {}}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Service Group</h3>
        <Label>
            <span>Service Group Name</span>
            <Input bind:value={serviceGroup.serviceGroupName} required />
        </Label>

        <Label>
            <span>Description</span>
            <Input bind:value={serviceGroup.description} required />
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox bind:checked={serviceGroup.multiselect}>
                Multiselect
            </Checkbox>
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox bind:checked={serviceGroup.showOnlineBookingPage}>
                Show on online booking page
            </Checkbox>
        </Label>

        <Button class="w-full" type="submit" on:click={handleEditServiceGroup}>Update</Button>
        <Button class="w-full" on:click={handleDeleteServiceGroup}>Delete</Button>
    </form>
</Modal>
