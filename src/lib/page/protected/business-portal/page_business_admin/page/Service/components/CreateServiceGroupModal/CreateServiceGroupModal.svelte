<script>
    import {Button, Checkbox, Input, Label, Modal} from "flowbite-svelte";
    import {ServiceGroup} from "$lib/api/initialize_functions/Business.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";

    export let open = false;

    let serviceGroup = ServiceGroup();

    // Reset
    let wasOpen = open;
    $: if (open && !wasOpen) {
        wasOpen = true;
        serviceGroup = ServiceGroup();
    } else if (!open) {
        wasOpen = false;
    }

    async function handleCreateServiceGroup() {
        console.log('Adding new service group:', serviceGroup);

        // Add the new service group
        $business.serviceGroupList.push(serviceGroup);

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Close the modal and reset the fields
        open = false;
        serviceGroup = ServiceGroup();
    }
</script>

<Modal bind:open={open} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-2" on:submit|preventDefault={() => {}}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New Service Group</h3>
        <Label>
            <span>Service Group Name</span>
            <Input bind:value={serviceGroup.serviceGroupName} required/>
        </Label>

        <Label>
            <span>Description</span>
            <Input bind:value={serviceGroup.description} required/>
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

        <Button class="w-full" type="submit" on:click={handleCreateServiceGroup}>Add</Button>
    </form>
</Modal>
