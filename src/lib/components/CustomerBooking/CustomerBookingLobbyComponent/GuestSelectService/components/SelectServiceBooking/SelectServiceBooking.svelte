<script>
    import Select from 'svelte-select';
    import {business} from "$lib/page/stores/business/business.js";
    import {CustomerIndividualServiceBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {ClockOutline} from "flowbite-svelte-icons";

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

    $:console.log("serviceSelectOptions", serviceSelectOptions);

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
        generateEmployeeOptions(serviceBooking.service) : [{label: "Any employee", value: null}];

    $: selectedService = serviceSelectOptions.find(option => option.value.id === serviceBooking?.service?.id) || null;
    $: selectedEmployee = employeeSelectOptions.find(option => option.value?.id === serviceBooking?.bookedEmployee?.id);

    function handleServiceBookingSelect(event) {
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
        } else {
            serviceBooking.service = newService;
        }
    }

    function handleDeleteServiceBooking() {
        // console.log("handleDeleteServiceBooking", event);

        if (serviceBookingIndex < individualBooking.customerIndividualServiceBookingList.length) {
            individualBooking.customerIndividualServiceBookingList = [
                ...individualBooking.customerIndividualServiceBookingList.slice(0, serviceBookingIndex),
                ...individualBooking.customerIndividualServiceBookingList.slice(serviceBookingIndex + 1)
            ];

            console.log(`individualBooking.customerIndividualServiceBookingList ${serviceBookingIndex}`, individualBooking.customerIndividualServiceBookingList)
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

    function customFilter(label, filterText, option) {
        const tokens = tokenize(filterText);
        const labelTokens = tokenize(label);

        // All the tokens to match at least one
        return tokens.every(token => labelTokens.some(labelToken => labelToken.includes(token)));
    }
</script>

<div class="max-w-[250px]">
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

            itemFilter={customFilter}
    >
        <svelte:fragment slot="item" let:item>
            <div class="flex flex-col">
                {#if item.groupHeader}
                    <div class="font-semibold">
                        {item.label}
                    </div>
                {:else if item.groupItem}
                    <div class="space-y-0 text-inherit">
                        <div class="flex flex-row justify-between items-center text-left text-sm text-inherit">
                            <span class="font-bold">{item.label}</span>
                            <span class="font-semibold">${item.value.serviceCost}</span>
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
        />
    {/if}
</div>

<style>
    :global(.svelte-select-list) {
        width: 400px !important;
        height: fit-content !important;
    }
</style>