<script>
    import {Button, Select} from "flowbite-svelte";
    import {onMount} from "svelte";

    export let service;
    export let customerIndividual;

    function getServiceBookingInfo()
    {
        return customerIndividual.find(serviceBookingInfo => serviceBookingInfo.service.id === service.id);
    }

    function getEmployeeFromEmployeeId(employeeId)
    {
        return service.employeeList.find(employee => employee.id === employeeId) || null;
    }

    function employeeToSelectOption(employee)
    {
        return {
            value: employee.id,
            name: employee.employeeName,
            data: employee  // holding the full employee object
        }
    }

    let employeeSelectOptions = [];
    let isSelected = false;
    let employeeIdSelected = -1;
    let serviceBookingInfo = undefined;

    function initializeSelectedServiceBookingInfo(serviceBooking)
    {
        serviceBookingInfo = serviceBooking;
        isSelected = (serviceBookingInfo !== undefined);
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

        let selected = getServiceBookingInfo();
        initializeSelectedServiceBookingInfo(selected);
    });

    // Employee selected change
    $: if (isSelected)
    {
        // Get the selected employee id from the service booking
        let serviceBookingSelectedEmployeeId = serviceBookingInfo.employee?.id ?? -1;
        if (serviceBookingSelectedEmployeeId !== employeeIdSelected)
        {
            // Set the new employee for the service booking
            serviceBookingInfo.employee = getEmployeeFromEmployeeId(employeeIdSelected);
        }
    }

    // Reactively update whenever customerIndividual changes
    $: {
        let selectedServiceBooking = customerIndividual.find(info => info.service.id === service.id);
        initializeSelectedServiceBookingInfo(selectedServiceBooking);
    }

    function toggleServiceSelection()
    {
        if (isSelected)
        {
            // First, find the index of the serviceBookingInfo with the given serviceId
            const index = customerIndividual.findIndex(serviceBookingInfo => serviceBookingInfo.service.id === service.id);

            // Remove the service from the list
            if (index !== -1)
            {
                customerIndividual.splice(index, 1);
            }
        }
        else
        {
            // Get employee
            let employeeSelected = getEmployeeFromEmployeeId(employeeIdSelected);

            // Create the service booking info
            serviceBookingInfo = {
                service: service,
                employee: employeeSelected
            };

            // Add the service with the selected employee to the list
            customerIndividual.push(serviceBookingInfo);
        }

        // Toggle the selected flag
        isSelected = !isSelected;
    }
</script>

<div class="mb-4">
    <h3 class="font-bold">{service.serviceName} ({service.serviceCost.toFixed(2)})</h3>
    <p>Duration: {service.serviceTimeLength} minutes</p>

    <div class="select-container">
        <label for="employee-select">Employee:</label>
        <Select class="mt-2"
                items={employeeSelectOptions}
                bind:value={employeeIdSelected}
        />
    </div>

    <div class="mt-4">
        <Button class="{isSelected ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-transparent hover:bg-green-100 text-green-500'} border-2 border-green-500 hover:border-green-600 text-sm font-medium rounded-lg px-4 py-2 transition ease-in-out duration-150"
                on:click={toggleServiceSelection}>
            {isSelected ? 'Deselect' : 'Select'}
        </Button>
    </div>
</div>
