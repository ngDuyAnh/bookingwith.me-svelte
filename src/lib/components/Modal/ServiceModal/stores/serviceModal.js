import {get, writable} from "svelte/store";
import {Service} from "$lib/api/initialize_functions/Business.js";
import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
import {business} from "$lib/page/stores/business/business.js";
import {findServiceFromBusiness, findServiceGroupFromBusinessUsingID} from "$lib/api/utilitiy_functions/Business.js";

export const serviceModal = writable({
    open: false,
    createServiceForServiceGroupID: undefined,
    service: Service()
});

export function handleOpenCreateNewServiceModal(serviceGroup)
{
    console.log("Create service for service group", serviceGroup);

    serviceModal.set({
        open: true,
        createServiceForServiceGroupID: serviceGroup.id,
        service: {
            ...Service(),
        }
    })
}

export function handleOpenEditServiceModal(service)
{
    console.log("Edit service", service);

    // Clone the service
    // User is null, initialize it
    serviceModal.set({
        open: true,
        createServiceForServiceGroupID: undefined,
        service: JSON.parse(JSON.stringify(service))
    });
}

export function handleCloseServiceModal()
{
    serviceModal.set({
        open: false,
        createServiceForServiceGroupID: undefined,
        service: Service()
    })
}

export function handleSaveServiceModal()
{
    const businessValue = get(business);
    const serviceModalValue = get(serviceModal);

    console.log('Updating service:', serviceModalValue.service);

    // Create new service
    if (serviceModalValue.createServiceForServiceGroupID)
    {
        // Get the service group
        const serviceGroup = findServiceGroupFromBusinessUsingID(
            businessValue, serviceModalValue.createServiceForServiceGroupID
        );

        // Add the new service to the service group
        serviceGroup.serviceList.push(serviceModalValue.service);
    }
    // Existing
    else
    {
        // Get the service instance from the business
        const service = findServiceFromBusiness(
            businessValue, serviceModalValue.service
        );

        // Deep copy
        Object.assign(
            service,
            serviceModalValue.service
        );
    }

    // Request the server to update
    initializeBusiness(businessValue)
        .then(response => {
            business.set(response);
        });

    // Close the modal
    handleCloseServiceModal();
}

export function handleDeleteServiceModal() {
    const businessValue = get(business);
    const serviceModalValue = get(serviceModal);

    console.log('Deleting service:', serviceModalValue.service);

    // Confirm deletion
    if (confirm('Are you sure you want to delete this service?')) {
        // Get the service instance from the business
        const service = findServiceFromBusiness(
            businessValue, serviceModalValue.service
        );

        // Set the service as archive
        service.archive = true;

        // Request the server to update
        initializeBusiness(businessValue)
            .then(response => {
                business.set(response);
            });

        // Close the modal
        handleCloseServiceModal();
    }
}
