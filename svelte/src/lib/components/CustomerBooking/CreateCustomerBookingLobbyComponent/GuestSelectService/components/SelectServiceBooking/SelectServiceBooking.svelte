<script>
    import Select from 'svelte-select';
    import {business} from "$lib/page/stores/business/business.js";

    export let serviceBooking = null;

    $: selectedService = serviceBooking !== null ?
        serviceBooking.service : null;
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
    <Select value={null} items={employeeSelectOptions}/>
</div>
