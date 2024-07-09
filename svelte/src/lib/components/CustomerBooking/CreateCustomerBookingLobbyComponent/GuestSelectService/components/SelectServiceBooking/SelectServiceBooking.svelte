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

<div class="max-w-[300px]">
    <Select --margin="2px 0px"
            items={serviceSelectOptions} groupBy={(item) => item.group}
            on:change={() => {}}
            placeholder="Select a service"
    />
    <Select value={null} placeholder="Select an employee" items={employeeSelectOptions}/>
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