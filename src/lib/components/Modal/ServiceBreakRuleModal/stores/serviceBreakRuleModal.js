import {get, writable} from "svelte/store";
import {
    getServiceBreakRuleList,
    initializeServiceBreakRuleList
} from "$lib/api/api_server/api_endpoints/business-portal/api.js";

export const serviceBreakRuleModal = writable({
    open: false,
    service: undefined,
    serviceBreakRuleList: []
});

export async function handleOpenServiceBreakRuleModal(service)
{
    try
    {
        // Get the service break rules
        const {serviceBreakRuleList} = await getServiceBreakRuleList(service.id);

        // Open the modal
        serviceBreakRuleModal.set({
            open: true,
            service: service,
            serviceBreakRuleList: serviceBreakRuleList
        });
    }
    catch (error)
    {
        alert(error);
    }
}

export function handleCloseServiceBreakRuleModal()
{
    serviceBreakRuleModal.set({
        open: false,
        service: undefined,
        serviceBreakRuleList: []
    });
}

export function handleSaveServiceBreakRuleModal()
{
    const serviceBreakRuleModalValue = get(serviceBreakRuleModal);

    if (serviceBreakRuleModalValue.service &&
        serviceBreakRuleModalValue.serviceBreakRuleList &&
        confirm(`Confirm changes to ${serviceBreakRuleModalValue.service.serviceName}?`))
    {
        // Submit the update to the server
        initializeServiceBreakRuleList(
            serviceBreakRuleModalValue.service.id,
            serviceBreakRuleModalValue.serviceBreakRuleList)
            .then(() => {
                console.log("Saved the service break rules to the database.")
            })

        // Close the modal
        handleCloseServiceBreakRuleModal();
    }
}
