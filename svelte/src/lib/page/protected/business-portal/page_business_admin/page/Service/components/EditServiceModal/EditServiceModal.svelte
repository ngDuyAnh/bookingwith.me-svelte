<script>
    import {Button, Checkbox, Input, Label, Modal, MultiSelect} from "flowbite-svelte";
    import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerBookingComponent/components/ServiceOption/functions.js";

    export let open = false;
    export let editingService;

    // Create the employee option for selection
    let employeeSelectOptions = []
    $: if ($business && $business.employeeList)
    {
        employeeSelectOptions = $business.employeeList.map(employee => employeeToSelectOption(employee));
    }

    // Set up the service for edit
    // Clone to not affect the original state
    let service = {};
    let editingServiceSelectedEmployees = [];
    let wasOpen = open;
    $: if (open && !wasOpen) {
        wasOpen = true;
        service = JSON.parse(JSON.stringify(editingService));
        editingServiceSelectedEmployees = employeeSelectOptions
            .filter(option => service.employeeList.some(employee => employee.id === option.data.id))
            .map(option => option.value);
    } else if (!open) {
        wasOpen = false;
        editingServiceSelectedEmployees = [];
    }

    async function handleUpdateEditService() {
        // Employee provide service
        service.employeeList = [];
        service.employeeList = editingServiceSelectedEmployees.map(employeeId => {
            let option = employeeSelectOptions.find(option => option.value === employeeId);
            return option.data;
        });

        console.log('Updating service:', service);

        // Deep clone
        Object.assign(editingService, service);

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Close the modal and reset the fields
        open = false;
        service = {};
    }

    async function handleDeleteService()
    {
        console.log('Deleting service:', editingService);

        // Confirm deletion
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }

        // Archive
        editingService.archive = true;

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Close the modal and reset editing state
        open = false;
        service = {};
    }
</script>

<Modal bind:open={open} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-2" action="#" on:submit|preventDefault={() => {}}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Service</h3>
        <Label>
            <span>Service Name</span>
            <Input bind:value={service.serviceName} required />
        </Label>

        <Label>
            <span>Cost</span>
            <Input type="number" bind:value={service.serviceCost} required/>
        </Label>

        <Label>
            <span>Duration (minutes)</span>
            <Input type="number" bind:value={service.serviceTimeLength} required/>
        </Label>

        <Label>
            <span>Description</span>
            <Input bind:value={service.description} required />
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox bind:checked={service.showPlus}>
                Show plus sign on booking page
            </Checkbox>
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox bind:checked={service.showOnlineBookingPage}>
                Show on online booking page
            </Checkbox>
        </Label>

        <Label>
            <span>Provided by Employees:</span>
            <MultiSelect items={employeeSelectOptions} bind:value={editingServiceSelectedEmployees}/>
        </Label>

        <Button class="w-full" type="submit" on:click={handleUpdateEditService}>Update</Button>
        <Button class="w-full" on:click={handleDeleteService}>Delete</Button>
    </form>
</Modal>
