<script>
    import {handleOpenEditServiceModal} from "$lib/components/Modal/ServiceModal/stores/serviceModal.js";
    import {Button} from "flowbite-svelte";
    import {dndzone} from 'svelte-dnd-action';
    import {business} from "$lib/page/stores/business/business.js";
    import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import {
        handleOpenServiceBreakRuleModal
    } from "$lib/components/Modal/ServiceBreakRuleModal/stores/serviceBreakRuleModal.js";

    const flipDurationMs = 200;

    export let serviceList;

    function handleSort(e) {
        serviceList = e.detail.items;
    }

    function handleFinalize(e) {
        serviceList = e.detail.items;
        initializeBusiness($business);
    }

</script>
<ul class="h-full px-4 py-1 shadow w-full overflow-y-auto space-y-2"
    use:dndzone={{items:serviceList, flipDurationMs, type:'columns'}}
    on:consider={(e) => handleSort(e)} on:finalize={(e) => handleFinalize(e)}>
    {#each serviceList as service (service.id)}
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
            <Button on:click={() => handleOpenEditServiceModal(service)}>Edit</Button>
            <Button on:click={() => handleOpenServiceBreakRuleModal(service)}>Break rules</Button>
        </div>
    {/each}
</ul>