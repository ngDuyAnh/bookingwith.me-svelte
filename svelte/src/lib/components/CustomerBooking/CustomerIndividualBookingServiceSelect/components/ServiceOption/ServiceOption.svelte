<script>
    import { Button, Select } from "flowbite-svelte";
    import { onMount } from "svelte";
    import {formatCost} from "$lib/application/FormatCost.js";
    import { CustomerIndividualServiceBooking } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {selectedServiceIds} from "$lib/page/stores/ServiceSelectionOptions/service_options_store.js";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/functions.js";

    export let service;
    export let customerIndividualBooking;
    export let serviceGroup; // Receive the serviceGroup list
    export let multiselect; // Receive the multiselect flag

    let employeeSelectOptions = [];
    let isSelected = false;
    let employeeIdSelected = -1;
    let serviceBookingInfo = undefined;

    function getServiceBookingInfo() {
        return customerIndividualBooking.customerIndividualServiceBookingList.find(serviceBooking => serviceBooking.service.id === service.id);
    }

    function getEmployeeFromEmployeeId(employeeId) {
        return service.employeeList.find(employee => employee.id === employeeId) || null;
    }

    function initializeSelectedServiceBookingInfo(serviceBooking) {
        serviceBookingInfo = serviceBooking;
        employeeIdSelected = serviceBookingInfo && serviceBookingInfo.employee ? serviceBookingInfo.employee.id : -1;
    }

    onMount(() => {
        employeeSelectOptions = [
            {
                value: -1,
                name: "Any",
                data: null
            },
            ...service.employeeList.map(employee => employeeToSelectOption(employee))
        ];
        employeeIdSelected = -1;

        let selectedBooking = getServiceBookingInfo();
        initializeSelectedServiceBookingInfo(selectedBooking);
    });


    $: isSelected = $selectedServiceIds.has(service.id)


    // Employee selected change
    $: if (isSelected) {
        // Get the selected employee id from the service booking
        let serviceBookingSelectedEmployeeId = serviceBookingInfo?.employee?.id ?? -1;
        if (serviceBookingSelectedEmployeeId !== employeeIdSelected) {
            serviceBookingInfo.employee = getEmployeeFromEmployeeId(employeeIdSelected);
        }
    }

    // Reactively update whenever customerIndividual changes
    $: {
        let selectedServiceBooking = getServiceBookingInfo();
        initializeSelectedServiceBookingInfo(selectedServiceBooking);
    }

    function toggleServiceSelection() {
        let currentSelectedServiceIds = new Set($selectedServiceIds);


        if (isSelected) {
            const index = customerIndividualBooking.customerIndividualServiceBookingList.findIndex(serviceBookingInfo => serviceBookingInfo.service.id === service.id);
            if (index !== -1) {
                customerIndividualBooking.customerIndividualServiceBookingList.splice(index, 1);
                currentSelectedServiceIds.delete(service.id);
            }
        } else {
            if (!multiselect) {
                serviceGroup.forEach(groupService => currentSelectedServiceIds.delete(groupService.id));
                // If multiselect is false, remove other services from the same group
                customerIndividualBooking.customerIndividualServiceBookingList = customerIndividualBooking.customerIndividualServiceBookingList.filter(serviceBooking => !serviceGroup.some(groupService => groupService.id === serviceBooking.service.id));
            }

            let employeeSelected = getEmployeeFromEmployeeId(employeeIdSelected);
            serviceBookingInfo = {
                service: service,
                employee: employeeSelected
            };

            customerIndividualBooking.customerIndividualServiceBookingList.push({
                ...CustomerIndividualServiceBooking(),
                service: service,
                employee: employeeSelected
            });

            currentSelectedServiceIds.add(service.id);

        }

        isSelected = !isSelected;
        selectedServiceIds.set(currentSelectedServiceIds);
    }

    function callFromSelect()
    {
        isSelected = false;
        toggleServiceSelection();
    }

</script>

<div class="mb-8">
    <h3 class="font-bold">{service.serviceName} · ${formatCost(service.serviceCost)}+</h3>
    <p>{service.description}</p>

    <div class="mt-1">
        <label for="employee-select">Employee:</label>
        <Select items={employeeSelectOptions} bind:value={employeeIdSelected} on:change={()=>{if(isSelected && !multiselect)callFromSelect()}}/>
    </div>

    <div class="mt-1">
        <Button class="{isSelected ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-transparent hover:bg-green-100 text-green-500'} border-2 border-green-500 hover:border-green-600 text-sm font-medium rounded-lg px-4 py-2 transition ease-in-out duration-150"
                on:click={()=>toggleServiceSelection()}>
            {isSelected ? 'Deselect' : 'Select'}
        </Button>
    </div>
</div>
