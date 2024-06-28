<script>
    import {Accordion, AccordionItem, Button} from 'flowbite-svelte';
    import {business} from "$lib/page/stores/business/business.js";
    import CreateServiceGroupModal
        from "$lib/page/protected/business-portal/page_business_admin/page/Service/components/CreateServiceGroupModal/CreateServiceGroupModal.svelte";
    import EditServiceGroupModal
        from "$lib/page/protected/business-portal/page_business_admin/page/Service/components/EditServiceGroupModal/EditServiceGroupModal.svelte";
    import CreateServiceModal
        from "$lib/page/protected/business-portal/page_business_admin/page/Service/components/CreateServiceModal/CreateServiceModal.svelte";
    import EditServiceModal
        from "$lib/page/protected/business-portal/page_business_admin/page/Service/components/EditServiceModal/EditServiceModal.svelte";

    let openCreateServiceGroupModal = false;
    let openEditServiceGroupModal = false;
    let editingServiceGroup = {};

    let openCreateServiceModal = false;
    let openEditServiceModal = false;
    let editingService = {};

    function handleOpenEditServiceGroupModal(serviceGroup) {
        editingServiceGroup = serviceGroup;
        openEditServiceGroupModal = true;
    }

    function handleOpenCreateServiceModal(serviceGroup)
    {
        editingServiceGroup = serviceGroup;
        openCreateServiceModal = true;
    }

    function handleOpenEditServiceModal(serviceGroup, service) {
        editingServiceGroup = serviceGroup;
        editingService = service;
        openEditServiceModal = true;
    }
</script>

<Accordion class="bg-white">
    {#each $business.serviceGroupList as serviceGroup, index}
        <AccordionItem open={index === 0}>
            <div slot="header" class="flex items-center w-full">
                <div class="flex flex-col sm:flex-row justify-between w-full items-center text-center sm:text-left">
                    <span class="font-semibold mb-2 sm:mb-0 sm:mr-3">{serviceGroup.serviceGroupName}</span>
                    <span class="mr-4 text-sm text-gray-500 flex-1">{serviceGroup.description}</span>
                    <Button class="mr-4" on:click={() => handleOpenCreateServiceModal(serviceGroup)}>Add new service</Button>
                    <Button class="mr-4" on:click={() => handleOpenEditServiceGroupModal(serviceGroup)}>Edit</Button>
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
                    <Button on:click={() => handleOpenEditServiceModal(serviceGroup, service)}>Edit</Button>
                </div>
            {/each}
        </AccordionItem>
    {/each}
</Accordion>

<div class="mt-4">
    <Button on:click={() => openCreateServiceGroupModal = true}>Add New Service Group</Button>
</div>

<!-- Modal for adding new service group -->
<CreateServiceGroupModal bind:open={openCreateServiceGroupModal}/>

<!-- Modal for editing service group -->
<EditServiceGroupModal
        bind:open={openEditServiceGroupModal}
        {editingServiceGroup}
/>

<!-- Modal for adding new service -->
<CreateServiceModal
        bind:open={openCreateServiceModal}
        serviceGroup={editingServiceGroup}
/>

<!-- Modal for editing service -->
<EditServiceModal
        bind:open={openEditServiceModal}
        {editingService}
/>
