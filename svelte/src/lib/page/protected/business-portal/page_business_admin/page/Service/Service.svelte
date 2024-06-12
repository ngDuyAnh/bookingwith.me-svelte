
<script>
    import {Accordion, AccordionItem, Button, Modal, Label, Input, MultiSelect, Checkbox} from 'flowbite-svelte';
    import {initializeBusiness} from "$lib/api/api_server/business-portal/api.js";
    import {business} from "$lib/page/stores/business/business.js";

    let editingServiceGroup = {};
    let editingCloneServiceGroup = {};
    let formModalServiceGroupEdit = false;

    let editingService = {};
    let editingCloneService = {};
    let formModalServiceEdit = false;

    // Employee provide service selection
    let editingServiceSelectedEmployees = [];

    function employeeToSelectOption(employee)
    {
        return {
            value: employee.id,
            name: employee.employeeName,
            data: employee  // holding the full employee object
        }
    }
    let employeeSelectOptions = []
    $: if ($business && $business.employeeList)
    {
        employeeSelectOptions = $business.employeeList.map(employee => employeeToSelectOption(employee));
    }

    let newServiceGroupName = '';
    let newServiceGroupDescription = '';
    let newServiceGroupMultiselect = false;
    let formModalAddServiceGroup = false;

    let addServiceToServiceGroup = {};
    let newServiceName = '';
    let newServiceCost = 0;
    let newServiceTimeLength = 0;
    let newServiceDescription = '';
    let formModalAddService = false;

    function openModalAddServiceToServiceGroup(serviceGroup) {
        addServiceToServiceGroup = serviceGroup;
        formModalAddService = true;
    }

    function openModalEditServiceGroup(serviceGroup) {
        editingServiceGroup = serviceGroup;
        editingCloneServiceGroup = { ...serviceGroup };
        formModalServiceGroupEdit = true;
    }

    function openModalEditService(serviceGroup, service) {
        editingServiceGroup = serviceGroup;
        editingService = service;
        editingCloneService = { ...service };
        formModalServiceEdit = true;

        // Employee provide service
        editingServiceSelectedEmployees = employeeSelectOptions
            .filter(option => service.employeeList.some(employee => employee.id === option.data.id))
            .map(option => option.value);
    }

    async function handleEditServiceGroup() {
        console.log('Updating service group with new details:', editingServiceGroup);

        // Deep clone
        Object.assign(editingServiceGroup, editingCloneServiceGroup);

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Reset the form fields and close the modal
        editingServiceGroup = {};
        editingCloneServiceGroup = {};
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

        // Close the modal and reset editing state
        editingServiceGroup = {};
        editingCloneServiceGroup = {};
    }

    async function handleEditService() {
        // Employee provide service
        editingCloneService.employeeList = [];
        editingCloneService.employeeList = editingServiceSelectedEmployees.map(employeeId => {
            let option = employeeSelectOptions.find(option => option.value === employeeId);
            return option.data;
        });

        console.log('Updating service with new details:', editingCloneService);

        // Deep clone
        Object.assign(editingService, editingCloneService);

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Reset the form fields and close the modal
        editingServiceGroup = {};
        editingService = {};
        editingCloneService = {};
        editingServiceSelectedEmployees = [];
    }

    async function handleAddServiceGroup() {
        console.log('Adding new service group:', {name: newServiceGroupName, description: newServiceGroupDescription, multiselect: newServiceGroupMultiselect});

        // Create a new service group object
        const newServiceGroup = {
            id: -1,
            serviceGroupName: newServiceGroupName,
            description: newServiceGroupDescription,
            archive: false,
            multiselect: newServiceGroupMultiselect,
            serviceList: [],
        };

        // Add the new service group
        $business.serviceGroupList.push(newServiceGroup);

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Reset the form fields and close the modal
        newServiceGroupName = '';
        newServiceGroupDescription = '';
        newServiceGroupMultiselect = false;
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
        editingServiceGroup = {};
        editingService = {};
        editingCloneService = {};
    }

    async function handleAddService()
    {
        console.log('Adding new service:', { name: newServiceName, cost: newServiceCost, timeLength: newServiceTimeLength, description: newServiceDescription });

        // Create a new service object
        const newService = {
            id: -1,
            serviceName: newServiceName,
            serviceCost: newServiceCost,
            serviceTimeLength: newServiceTimeLength,
            description: newServiceDescription,
            archive: false,
            employeeList: []
        };

        // Add the new service to the group
        addServiceToServiceGroup.serviceList.push(newService);

        // Request the server to update
        const response = await initializeBusiness($business);
        business.set(response);

        // Reset the form fields and close the modal
        newServiceName = '';
        newServiceCost = 0;
        newServiceTimeLength = 0;
        newServiceDescription = '';
    }
</script>

<Accordion class="bg-white">
    {#each $business.serviceGroupList as serviceGroup, index}
        <AccordionItem open={index === 0}>
            <div slot="header" class="flex items-center w-full">
                <div class="flex flex-col sm:flex-row justify-between w-full items-center text-center sm:text-left">
                    <span class="font-semibold mb-2 sm:mb-0 sm:mr-3">{serviceGroup.serviceGroupName}</span>
                    <span class="mr-4 text-sm text-gray-500 flex-1">{serviceGroup.description}</span>
                    <Button class="mr-4" on:click={() => openModalAddServiceToServiceGroup(serviceGroup)}>Add New Service</Button>
                    <Button class="mr-4" on:click={() => openModalEditServiceGroup(serviceGroup)}>Edit</Button>
                </div>
            </div>

            {#each serviceGroup.serviceList as service}
                <div class="mb-4">
                    <h3 class="font-bold">{service.serviceName}</h3>
                    <p>
                        Cost: ${service.serviceCost.toFixed(2)}{service.showPlus ? '+' : ''}
                    </p>
                    <p>Duration: {service.serviceTimeLength} minutes</p>
                    <p>Description: {service.description}</p>
                    <p>Available with:
                        {#if service.employeeList && service.employeeList.length > 0}
                            {service.employeeList.map(employee => employee.employeeName).join(', ')}
                        {:else}
                            No employees assigned
                        {/if}
                    </p>
                    <Button on:click={() => openModalEditService(serviceGroup, service)}>Edit</Button>
                </div>
            {/each}
        </AccordionItem>
    {/each}
</Accordion>

<div class="mt-4">
    <Button on:click={() => formModalAddServiceGroup = true}>Add New Service Group</Button>
</div>

<!-- Modal for editing service group -->
<Modal bind:open={formModalServiceGroupEdit} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={() => {}}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Service Group</h3>
        <Label class="">
            <span>Service Group Name</span>
            <Input bind:value={editingCloneServiceGroup.serviceGroupName} required />
        </Label>

        <Label class="">
            <span>Description</span>
            <Input bind:value={editingCloneServiceGroup.description} required />
        </Label>

        <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" bind:checked={editingCloneServiceGroup.multiselect} class="sr-only peer">
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Multiselect</span>
        </label>

        <Button class="w-full" on:click={handleEditServiceGroup}>Update</Button>
        <Button class="w-full" on:click={handleDeleteServiceGroup}>Delete</Button>
    </form>
</Modal>

<!-- Modal for editing service -->
<Modal bind:open={formModalServiceEdit} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-6" action="#" on:submit|preventDefault={() => {}}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Service</h3>
        <Label class="space-y-2">
            <span>Service Name</span>
            <Input bind:value={editingCloneService.serviceName} required />
        </Label>

        <Label class="space-y-2">
            <span>Cost</span>
            <Input type="number" bind:value={editingCloneService.serviceCost} required/>
        </Label>

        <Label class="space-y-2">
            <span>Duration (minutes)</span>
            <Input type="number" bind:value={editingCloneService.serviceTimeLength} required/>
        </Label>

        <Label class="space-y-2">
            <span>Description</span>
            <Input bind:value={editingCloneService.description} required />
        </Label>

        <Label class="space-y-2">
            <Checkbox bind:checked={editingCloneService.showPlus} required>
                Show plus sign
            </Checkbox>
        </Label>

        <Label class="space-y-2">
            <span>Provided by Employees:</span>
            <MultiSelect items={employeeSelectOptions} bind:value={editingServiceSelectedEmployees}/>
        </Label>

        <Button class="w-full" on:click={handleEditService}>Update</Button>
        <Button class="w-full" on:click={handleDeleteService}>Delete</Button>
    </form>
</Modal>

<!-- Modal for adding new service group -->
<Modal bind:open={formModalAddServiceGroup} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={() => {}}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New Service Group</h3>
        <Label class="space-y-2">
            <span>Service Group Name</span>
            <Input bind:value={newServiceGroupName} required />
        </Label>

        <Label class="space-y-2">
            <span>Description</span>
            <Input bind:value={newServiceGroupDescription} required />
        </Label>

        <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" bind:checked={newServiceGroupMultiselect} class="sr-only peer">
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Multiselect</span>
        </label>

        <Button class="w-full" type="submit" on:click={handleAddServiceGroup}>Add</Button>
    </form>
</Modal>

<!-- Modal for adding new service -->
<Modal bind:open={formModalAddService} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={() => {}}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New Service</h3>
        <Label class="space-y-2">
            <span>Service Name</span>
            <Input bind:value={newServiceName} required />
        </Label>

        <Label class="space-y-2">
            <span>Cost</span>
            <Input type="number" bind:value={newServiceCost} required />
        </Label>

        <Label class="space-y-2">
            <span>Duration (minutes)</span>
            <Input type="number" bind:value={newServiceTimeLength} required />
        </Label>

        <Label class="space-y-2">
            <span>Description</span>
            <Input bind:value={newServiceDescription} required />
        </Label>

        <Button class="w-full" type="submit" on:click={handleAddService}>Add</Button>
    </form>
</Modal>
