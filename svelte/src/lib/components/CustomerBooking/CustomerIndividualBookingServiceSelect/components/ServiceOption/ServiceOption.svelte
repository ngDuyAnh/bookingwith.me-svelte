<script>
    import {Button, Select} from "flowbite-svelte";
    import {formatCost} from "$lib/application/FormatCost.js";
    import {CustomerIndividualServiceBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/ServiceOption.js";

    export let serviceGroup;
    export let service;
    export let customerIndividualBookingList;
    export let guestIndex;

    let serviceBooking = undefined;
    let isSelected = false;
    let employeeIdSelected = -1;

    // Initialize employee select options immediately
    let employeeSelectOptions = [
        {
            value: -1,
            name: "Any",
            data: null
        },
        ...service.employeeList.map(employee => employeeToSelectOption(employee))
    ];

    function getServiceBooking()
    {
        return customerIndividualBookingList[guestIndex].customerIndividualServiceBookingList.find(serviceBooking => serviceBooking.service.id === service.id);
    }

    function getEmployeeFromEmployeeId(employeeId)
    {
        return service.employeeList.find(employee => employee.id === employeeId) || null;
    }

    // Initialize the state of the service select
    function initializeServiceBooking() {
        serviceBooking = getServiceBooking();
        if (serviceBooking) {
            isSelected = true;
            employeeIdSelected = serviceBooking?.employee?.id ?? -1;
        } else {
            isSelected = false;
            employeeIdSelected = -1;
        }
    }

    // Reactive statement to update serviceBooking when guestIndex changes
    $: if (guestIndex !== undefined)
    {
        initializeServiceBooking();
    }

    // Watch employeeIdSelected and update serviceBooking when it changes
    $: if (isSelected && serviceBooking && serviceBooking.employee?.id !== employeeIdSelected)
    {
        serviceBooking.employee = getEmployeeFromEmployeeId(employeeIdSelected);
    }

    function toggleServiceSelection()
    {
        console.log("toggleServiceSelection isSelected", isSelected);

        // Deselect
        if (isSelected)
        {
            const index = customerIndividualBookingList[guestIndex].customerIndividualServiceBookingList.findIndex(sb => sb.service.id === service.id);
            if (index !== -1) {
                customerIndividualBookingList[guestIndex].customerIndividualServiceBookingList.splice(index, 1);
            }

            console.log("Deselected", customerIndividualBookingList[guestIndex].customerIndividualServiceBookingList)
        }
        // Select
        else
        {
            // The service group is not multiselect
            // If there is existing selected service that is part of the group, remove it
            if (!serviceGroup.multiselect)
            {
                customerIndividualBookingList[guestIndex].customerIndividualServiceBookingList = customerIndividualBookingList[guestIndex].customerIndividualServiceBookingList.filter(
                    serviceBooking => !serviceGroup.serviceList.some(service => service.id === serviceBooking.service.id)
                );
            }

            // Create the service booking
            serviceBooking = {
                ...CustomerIndividualServiceBooking(),
                service: service,
                employee: getEmployeeFromEmployeeId(employeeIdSelected)
            };

            // Add the selected service
            customerIndividualBookingList[guestIndex].customerIndividualServiceBookingList.push(serviceBooking);
        }

        // Update the selected state
        isSelected = !isSelected;
    }
</script>

<div class="mb-8">
    <h3 class="font-bold">{service.serviceName} · ${formatCost(service.serviceCost)}+</h3>
    <p>{service.description}</p>

    <div class="mt-1">
        <label for="employee-select">Employee:</label>
        <Select items={employeeSelectOptions} bind:value={employeeIdSelected}/>
    </div>

    <div class="mt-1">
        <Button class="{isSelected ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-transparent hover:bg-green-100 text-green-500'} border-2 border-green-500 hover:border-green-600 text-sm font-medium rounded-lg px-4 py-2 transition ease-in-out duration-150"
                on:click={toggleServiceSelection}>
            {isSelected ? 'Deselect' : 'Select'}
        </Button>
    </div>
</div>
