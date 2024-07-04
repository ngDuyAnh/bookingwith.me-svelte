<script>
    import {Button, Label, Select} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {formatCost} from "$lib/application/FormatCost.js";
    import {CustomerIndividualServiceBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {selectedServiceIds} from "$lib/page/stores/selectedServiceIds/selectedServiceIds.js";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/functions.js";

    export let service;
    export let customerIndividualBooking;
    export let serviceGroup;
    export let multiselect;

    export let showAllEmployeeSelectOptions;

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
        employeeIdSelected = serviceBookingInfo && serviceBookingInfo.bookedEmployee ? serviceBookingInfo.bookedEmployee.id : -1;
    }

    onMount(() => {
        // Default option to select any employee
        employeeSelectOptions = [
            {
                value: -1,
                name: "Any employee",
                data: null
            }
        ];

        // Add the employee options
        service.employeeList.forEach(employee => {
            if (showAllEmployeeSelectOptions || employee.showOnlineBookingPage) {
                employeeSelectOptions.push(employeeToSelectOption(employee));
            }
        });

        // Preselect the Any option
        employeeIdSelected = -1;
        let selectedBooking = getServiceBookingInfo();
        initializeSelectedServiceBookingInfo(selectedBooking);
    });


    $: isSelected = $selectedServiceIds.has(service.id)


    // Employee selected change
    $: if (isSelected) {
        // Get the selected employee id from the service booking
        let serviceBookingSelectedEmployeeId = serviceBookingInfo?.bookedEmployee?.id ?? -1;
        if (serviceBookingSelectedEmployeeId !== employeeIdSelected) {
            serviceBookingInfo.bookedEmployee = getEmployeeFromEmployeeId(employeeIdSelected);
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
                bookedEmployee: employeeSelected
            };

            customerIndividualBooking.customerIndividualServiceBookingList.push({
                ...CustomerIndividualServiceBooking(),
                service: service,
                bookedEmployee: employeeSelected
            });

            currentSelectedServiceIds.add(service.id);

        }

        isSelected = !isSelected;
        selectedServiceIds.set(currentSelectedServiceIds);
    }

    function callFromSelect() {
        isSelected = false;
        if (multiselect) {
            let currentSelectedServiceIds = new Set($selectedServiceIds);
            const index = customerIndividualBooking.customerIndividualServiceBookingList.findIndex(serviceBookingInfo => serviceBookingInfo.service.id === service.id);
            if (index !== -1) {
                customerIndividualBooking.customerIndividualServiceBookingList.splice(index, 1);
                currentSelectedServiceIds.delete(service.id);
            }
        }
        toggleServiceSelection();
    }

</script>

<div class="flex flex-col mb-8 space-y-2">
    <h3 class="font-bold">
        {service.serviceName} · ${formatCost(service.serviceCost)}{service.showPlus ? '+' : ''}
    </h3>

    {#if service.description}
        <p>{service.description}</p>
    {/if}

    <div class="flex flex-row space-x-3 items-center">
        <div class="disable-double-tap-zoom">
            <Button class="{isSelected ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-transparent hover:bg-green-100 text-green-500'} border-2 border-green-500 hover:border-green-600 text-sm font-medium rounded-lg px-4 py-2 transition ease-in-out duration-150"
                    on:click={()=>toggleServiceSelection()}>
                {isSelected ? 'Deselect' : 'Select'}
            </Button>
        </div>

        <Select class="w-fit"
                items={employeeSelectOptions}
                bind:value={employeeIdSelected}
                on:change={()=>{if(isSelected)callFromSelect()}}
        />
    </div>
</div>
