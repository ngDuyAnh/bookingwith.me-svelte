<script>
    import Select from 'svelte-select';
    import {business} from "$lib/page/stores/business/business.js";
    import {CustomerIndividualServiceBooking} from "$lib/api/initialize_functions/CustomerBooking.js";

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

            console.log("Add new service booking", individualBooking)
        }
        else
        {
            serviceBooking.service = newService;
        }
    }

    function handleDeleteServiceBooking(event)
    {
        let service = event.detail.value;

        const index = individualBooking.customerIndividualServiceBookingList.findIndex(serviceBooking => serviceBooking.service.id === service.id);
        if (index !== -1) {
            individualBooking.customerIndividualServiceBookingList.splice(index, 1);
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

<div>
    <Select
            items={serviceSelectOptions} groupBy={(item) => item.group}
            value={selectedService}
            on:change={handleServiceBookingSelect}
            on:clear={handleDeleteServiceBooking}
    />
    <Select items={employeeSelectOptions} clearable={false}
            value={selectedEmployee}
            on:change={handleEmployeeSelect}
    />
</div>
