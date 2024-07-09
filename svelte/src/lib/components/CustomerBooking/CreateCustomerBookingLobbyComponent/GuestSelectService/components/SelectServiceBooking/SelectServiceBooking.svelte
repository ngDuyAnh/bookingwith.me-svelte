<script>
    import Select from 'svelte-select';
    import {business} from "$lib/page/stores/business/business.js";

    export let serviceBooking = null;

    $: selectedService = serviceSelectOptions.find(option => option.value.id === serviceBooking.service?.id) || null;
    $: selectedEmployee = serviceBooking !== null ?
        serviceBooking.bookedEmployee : null;

    $: serviceSelectOptions = $business.serviceGroupList.flatMap(group =>
        group.serviceList.map(service => ({
            group: group.serviceGroupName,
            label: service.serviceName,
            value: service
    })));

    function generateEmployeeOptions(service) {
        const options = [{
            label: "Any employee",
            value: null
        }];
        service.employeeList.forEach(employee => {
            options.push({
                label: employee.employeeName,
                value: employee
            });
        });
        return options;
    }

    $: employeeSelectOptions = selectedService ?
        generateEmployeeOptions(selectedService) : [{ label: "Any employee", value: null }];

</script>

<div>
    <Select
            items={serviceSelectOptions} groupBy={(item) => item.group}
            on:change={() => {}}
    />
    <Select value={selectedEmployee} items={employeeSelectOptions}/>
</div>
