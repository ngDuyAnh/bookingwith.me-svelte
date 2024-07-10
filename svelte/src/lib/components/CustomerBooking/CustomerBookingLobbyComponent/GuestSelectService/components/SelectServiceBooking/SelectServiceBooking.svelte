<script>
    import Select from 'svelte-select';
    import {business} from "$lib/page/stores/business/business.js";
    import {CustomerIndividualServiceBooking} from "$lib/api/initialize_functions/CustomerBooking.js";

    export let newServiceSelect = false;

    export let individualBooking;
    export let serviceBookingIndex;

    // Get the service booking
    $: serviceBooking = individualBooking.customerIndividualServiceBookingList[serviceBookingIndex];

    $: serviceSelectOptions = $business.serviceGroupList.flatMap(group =>
        group.serviceList.map(service => ({
            group: group.serviceGroupName,
            label: service.serviceName,
            value: service
    })));

    function generateEmployeeOptions(service) {

        // console.log("generateEmployeeOptions", service);

        const options = [{
            label: "Any employee",
            value: null
        }];

        // Employees who provide the service
        service.employeeList.forEach(employee => {
            options.push({
                label: employee.employeeName,
                value: employee
            });
        });

        // Return
        return options;
    }

    $: employeeSelectOptions = serviceBooking ?
        generateEmployeeOptions(serviceBooking.service) : [{ label: "Any employee", value: null }];

    $: selectedService = serviceSelectOptions.find(option => option.value.id === serviceBooking?.service?.id) || null;
    $: selectedEmployee = employeeSelectOptions.find(option => option.value?.id === serviceBooking?.bookedEmployee?.id);

    function handleServiceBookingSelect(event)
    {
        // console.log("handleServiceBookingSelect", event);

        let newService = event.detail.value;

        // Create new service booking
        if (individualBooking.customerIndividualServiceBookingList.length === serviceBookingIndex)
        {
            individualBooking.customerIndividualServiceBookingList = [
                ...individualBooking.customerIndividualServiceBookingList,
                {
                    ...CustomerIndividualServiceBooking(),
                    service: newService,
                    bookedEmployee: null
                }
            ];

            // console.log("Add new service booking", individualBooking)
        }
        else
        {
            serviceBooking.service = newService;
        }
    }

    function handleDeleteServiceBooking()
    {
        // console.log("handleDeleteServiceBooking", event);

        if (serviceBookingIndex < individualBooking.customerIndividualServiceBookingList.length)
        {
            individualBooking.customerIndividualServiceBookingList = [
                ...individualBooking.customerIndividualServiceBookingList.slice(0, serviceBookingIndex),
                ...individualBooking.customerIndividualServiceBookingList.slice(serviceBookingIndex + 1)
            ];

            console.log(`individualBooking.customerIndividualServiceBookingList ${serviceBookingIndex}`, individualBooking.customerIndividualServiceBookingList)
        }
    }

    function handleEmployeeSelect(event)
    {
        // console.log("handleEmployeeSelect", event);

        let newEmployee = event.detail.value;

        // Select the employee
        if (serviceBookingIndex < individualBooking.customerIndividualServiceBookingList.length)
        {
            serviceBooking.bookedEmployee = newEmployee;

            console.log("handleEmployeeSelect serviceBooking", serviceBooking);
        }
    }
</script>

<div class="max-w-[300px]">
    <Select --margin="2px 0px"
            items={serviceSelectOptions} groupBy={(item) => item.group}
            value={selectedService}
            on:change={handleServiceBookingSelect}
            on:clear={handleDeleteServiceBooking}
    />

    {#if !newServiceSelect}
        <Select items={employeeSelectOptions} clearable={false}
                value={selectedEmployee}
                on:change={handleEmployeeSelect}
                disabled={!selectedService}
        />
    {/if}
</div>

<style>
    :global(.svelte-select-list) {
        /*background:#FA517A!important;*/
        /*background-color: #333333 !important;*/
        /*z-index: 10000000000 !important;*/
        width: 300px !important;
        height: fit-content !important;
    }
</style>