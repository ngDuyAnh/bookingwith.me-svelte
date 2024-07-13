<script>
    import {Button, Checkbox, Input, Label, Modal} from "flowbite-svelte";
    import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {Service} from "$lib/api/initialize_functions/Business.js";

    export let open = false;
    export let serviceGroup;

    // Reset
    let wasOpen = open;
    let service = {};
    $: if (open && !wasOpen) {
        wasOpen = true;
        service = Service();
    } else if (!open) {
        wasOpen = false;
        service = {};
    }

    async function handleCreateService()
    {
        console.log('Adding new service:', service);

        // Add the new service to the group
        serviceGroup.serviceList.push(service);

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Close the modal and reset the fields
        open = false;
        service = Service();
    }
</script>

<Modal bind:open={open} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={() => {}}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New Service</h3>
        <Label class="space-y-2">
            <span>Service Name</span>
            <Input bind:value={service.serviceName} required />
        </Label>

        <Label class="space-y-2">
            <span>Cost</span>
            <Input type="number" bind:value={service.serviceCost} required />
        </Label>

        <Label class="space-y-2">
            <span>Duration (minutes)</span>
            <Input type="number" bind:value={service.serviceTimeLength} required />
        </Label>

        <Label class="space-y-2">
            <span>Description</span>
            <Input bind:value={service.description} required />
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox bind:checked={service.showPlus}>
                Show plus sign on booking page
            </Checkbox>
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox bind:checked={serviceGroup.showOnlineBookingPage}>
                Show on online booking page
            </Checkbox>
        </Label>

        <Button class="w-full" type="submit" on:click={handleCreateService}>Add</Button>
    </form>
</Modal>
