import {get, writable} from "svelte/store";
import {ServiceGroup} from "$lib/api/initialize_functions/Business.js";
import {business} from "$lib/page/stores/business/business.js";
import {
    findServiceFromBusiness,
    findServiceGroupFromBusiness
} from "$lib/api/utilitiy_functions/Business.js";
import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";

export const serviceGroupModal = writable({
    open: false,
    createServiceGroupFlag: true,
    serviceGroup: ServiceGroup()
});

export function handleOpenCreateNewServiceGroupModal() {
    serviceGroupModal.set({
        open: true,
        createServiceGroupFlag: true,
        serviceGroup: ServiceGroup()
    });
}

export function handleOpenEditServiceGroupModal(serviceGroup)
{
    serviceGroupModal.set({
        open: true,
        createServiceGroupFlag: true,
        serviceGroup: JSON.parse(JSON.stringify(serviceGroup))
    });
}

export function handleCloseServiceGroupModal()
{
    serviceGroupModal.set({
        open: false,
        createServiceGroupFlag: true,
        serviceGroup: ServiceGroup()
    });
}

export function handleSaveServiceGroupModal()
{
    const businessValue = get(business);
    const serviceGroupModalValue = get(serviceGroupModal);

    console.log('Updating service:', serviceGroupModalValue.serviceGroup);

    // Create new service group
    if (serviceGroupModalValue.createServiceGroupFlag)
    {
        // Add the new service group to the business
        businessValue.serviceGroupList.push(serviceGroupModalValue.serviceGroup);
    }
    // Existing
    else
    {
        // Get the service instance from the business
        const serviceGroup = findServiceFromBusiness(
            businessValue, serviceGroupModalValue.serviceGroup
        );

        // Deep copy
        Object.assign(
            serviceGroup,
            serviceGroupModalValue.service
        );
    }

    // Request the server to update
    initializeBusiness(businessValue)
        .then(response => {
            business.set(response);
        });

    // Close the modal
    handleCloseServiceGroupModal();
}

export function handleDeleteServiceGroupModal()
{
    const businessValue = get(business);
    const serviceGroupModalValue = get(serviceGroupModal);

    console.log('Deleting service:', serviceGroupModalValue.service);


    // Confirm deletion
    if (confirm('Are you sure you want to delete this service group?')) {
        // Get the service instance from the business
        const serviceGroup = findServiceGroupFromBusiness(
            businessValue, serviceGroupModalValue.serviceGroup
        );

        // Set the service as archive
        serviceGroup.archive = true;

        // Request the server to update
        initializeBusiness(businessValue)
            .then(response => {
                business.set(response);
            });

        // Close the modal
        handleCloseServiceGroupModal();
    }
}
