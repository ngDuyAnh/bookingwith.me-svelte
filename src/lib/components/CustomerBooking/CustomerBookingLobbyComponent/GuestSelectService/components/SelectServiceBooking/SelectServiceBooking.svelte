<script>
    import Select from 'svelte-select';
    import {business} from "$lib/page/stores/business/business.js";
    import {CustomerIndividualServiceBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {ClockOutline} from "flowbite-svelte-icons";

    export let newServiceSelect = false;

    export let individualBooking;
    export let serviceBookingIndex;

    export let selectedSomething;

    const defaultEmployeeOption = {label: "Any employee", value: null};

    // Get the service booking
    $: serviceBooking = individualBooking.customerIndividualServiceBookingList[serviceBookingIndex];

    $: serviceSelectOptions = $business.serviceGroupList.flatMap(group =>
        group.serviceList.map(service => ({
            group: group.serviceGroupName,
            label: service.serviceName,
            value: service
        })));

    // $:console.log("serviceSelectOptions", serviceSelectOptions);

    function generateEmployeeOptions() {

        // console.log("generateEmployeeOptions", service);

        const options = [defaultEmployeeOption];

        // Employees who provide the service
        $business.employeeList.forEach(employee => {
            options.push({
                label: employee.employeeName,
                value: employee
            });
        });

        // Return
        return options;
    }

    const employeeSelectOptions = generateEmployeeOptions();

    $: selectedService = serviceSelectOptions.find(option => option.value.id === serviceBooking?.service?.id) || null;
    $: selectedEmployee = employeeSelectOptions.find(option => option.value?.id === serviceBooking?.bookedEmployee?.id);

    function handleServiceBookingSelect(event) {
        selectedSomething=true;
        // console.log("handleServiceBookingSelect", event);

        let newService = event.detail.value;

        // Create new service booking
        if (individualBooking.customerIndividualServiceBookingList.length === serviceBookingIndex) {
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
        // Existing service booking
        else {
            serviceBooking.service = newService;

            // Keep the employee selected if the employee also provides the service
            // If the employee does not provide the service, default it back to any employee
            const employeesProvidingService = newService.employeeList.map(employee => employee.id);
            if (!employeesProvidingService.includes(serviceBooking.bookedEmployee?.id)) {
                serviceBooking.bookedEmployee = null;
            }
        }
    }

    function handleDeleteServiceBooking() {
        if (serviceBookingIndex < individualBooking.customerIndividualServiceBookingList.length) {
            individualBooking.customerIndividualServiceBookingList = [
                ...individualBooking.customerIndividualServiceBookingList.slice(0, serviceBookingIndex),
                ...individualBooking.customerIndividualServiceBookingList.slice(serviceBookingIndex + 1)
            ];
        }
    }

    function handleEmployeeSelect(event) {
        // console.log("handleEmployeeSelect", event);

        let newEmployee = event.detail.value;

        // Select the employee
        if (serviceBookingIndex < individualBooking.customerIndividualServiceBookingList.length) {
            // Force reactivity
            individualBooking.customerIndividualServiceBookingList = [
                ...individualBooking.customerIndividualServiceBookingList.slice(0, serviceBookingIndex),
                {...serviceBooking, bookedEmployee: newEmployee},
                ...individualBooking.customerIndividualServiceBookingList.slice(serviceBookingIndex + 1)
            ];

            // console.log("handleEmployeeSelect serviceBooking", serviceBooking);
        }
    }

    // Custom search filter
    function tokenize(str) {
        return str.toLowerCase().split(/\s+/);
    }

    function customServiceFilter(label, filterText) {
        const tokens = tokenize(filterText);
        const labelTokens = tokenize(label);

        // All tokens must match the start of at least one label token
        return tokens.every(token => labelTokens.some(labelToken => labelToken.startsWith(token)));
    }

    function customEmployeeFilter(label, filterText) {
        const tokens = tokenize(filterText);
        const labelTokens = tokenize(label);

        // Filter based on all employee
        if (filterText.length)
        {
            return tokens.every(token => labelTokens.some(labelToken => labelToken.includes(token)));
        }
        // If the filter text is empty
        // Only show employees who provide the service
        else if (selectedService)
        {
            return selectedService.value.employeeList.some(employee =>
                label.includes(defaultEmployeeOption.label) || label.includes(employee.employeeName)
            );
        }

        // Default do not show any employee option
        return false;
    }

</script>

<div class="max-w-[100%]">
    <Select --margin="2px 0px"
            --font-size="0.9rem"
            floatingConfig={{ strategy: 'fixed' }}
            --item-height="auto"
            --input-color="black"
            --list-border="1px solid #006fe8"

            items={serviceSelectOptions} groupBy={(item) => item.group}
            value={selectedService}
            on:change={handleServiceBookingSelect}
            on:clear={handleDeleteServiceBooking}

            itemFilter={customServiceFilter}
    >
        <svelte:fragment slot="item" let:item>
            <div class="flex flex-col">
                {#if item.groupHeader}
                    <div class="font-semibold">
                        {item.label}
                    </div>
                {:else if item.groupItem}
                    <div class="space-y-0 text-inherit">
                        <div class="flex flex-row justify-between items-center text-sm">
                            <span class="font-bold flex-grow text-wrap">{item.label}</span>
                            <span class="font-extrabold flex-shrink-0 pl-3">${item.value.serviceCost}</span>
                        </div>
                        <div class="flex flex-row items-center text-left text-xs text-inherit">
                            <ClockOutline/> {item.value.serviceTimeLength} minutes
                        </div>
                    </div>
                {/if}
            </div>
        </svelte:fragment>
    </Select>

    {#if !newServiceSelect}
        <Select
                --font-size="0.9rem"
                floatingConfig={{strategy: 'fixed',}}
                --multi-max-width="fit"
                --list-border="1px solid #006fe8"


                items={employeeSelectOptions} clearable={false}
                value={selectedEmployee}
                on:change={handleEmployeeSelect}
                disabled={!selectedService}

                itemFilter={customEmployeeFilter}
        />
    {/if}
</div>

<style>
    :global(.svelte-select-list) {
        width: 100% !important;
        height: fit-content !important;
    }

    @media (min-width: 450px) {
        :global(.svelte-select-list) {
            width: 400px !important;
        }
    }
</style>