<script>
    import {Button, Checkbox, Input, Label, Modal, MultiSelect} from "flowbite-svelte";
    import {
        handleDeleteServiceModal,
        handleSaveServiceModal,
        serviceModal
    } from "$lib/components/Modal/ServiceModal/stores/serviceModal.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerBookingComponent/components/ServiceOption/functions.js";

    // Create the employee option for selection
    let employeeSelectOptions = [];
    $: if ($business && $business.employeeList) {
        employeeSelectOptions = $business.employeeList.map(employee => employeeToSelectOption(employee));
    }

    // Initialize the selection
    let wasOpen = false;
    let editingServiceSelectedEmployees = [];

    $: if ($serviceModal.open && !wasOpen) {

        wasOpen = true;

        editingServiceSelectedEmployees = employeeSelectOptions
            .filter(option => $serviceModal.service.employeeList.some(employee => employee.id === option.data.id))
            .map(option => option.value);
    }
    // Register the changes from the selection
    else if ($serviceModal.open)
    {
        $serviceModal.service.employeeList = editingServiceSelectedEmployees.map(employeeId => {
            let option = employeeSelectOptions.find(option => option.value === employeeId);
            return option.data;
        });
    }
    // Reset
    else
    {
        wasOpen = false;
        editingServiceSelectedEmployees = [];
    }
</script>

<Modal bind:open={$serviceModal.open} size="xs" outsideclose>
    <form
            class="flex flex-col space-y-2"
            on:submit|preventDefault={handleSaveServiceModal}
    >
        {#if $serviceModal.createServiceForServiceGroupID}
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create service</h3>
        {:else}
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit service</h3>
        {/if}

        <Label>
            <span>Service Name</span>
            <Input
                    bind:value={$serviceModal.service.serviceName}
                    required
            />
        </Label>

        <Label>
            <span>Cost</span>
            <Input
                    type="number"
                    bind:value={$serviceModal.service.serviceCost}
                    required
            />
        </Label>

        <Label>
            <span>Duration (minutes)</span>
            <Input
                    type="number"
                    bind:value={$serviceModal.service.serviceTimeLength}
                    required
            />
        </Label>

        <Label>
            <span>Description</span>
            <Input
                    bind:value={$serviceModal.service.description}
            />
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox
                    bind:checked={$serviceModal.service.highlight}
            >
                Highlight on timetable
            </Checkbox>
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox
                    bind:checked={$serviceModal.service.showPlus}
            >
                Show plus sign on booking page
            </Checkbox>
        </Label>

        <Label class="inline-flex items-center cursor-pointer">
            <Checkbox
                    bind:checked={$serviceModal.service.showOnlineBookingPage}
            >
                Show on online booking page
            </Checkbox>
        </Label>

        <Label>
            <span>Provided by Employees:</span>
            <MultiSelect
                    items={employeeSelectOptions}
                    bind:value={editingServiceSelectedEmployees}
            />
        </Label>

        {#if $serviceModal.createServiceForServiceGroupID}
            <Button
                    class="w-full"
                    type="submit"
            >
                Add
            </Button>
        {:else}
            <Button
                    class="w-full"
                    type="submit"
            >
                Save
            </Button>
            <Button class="w-full" on:click={handleDeleteServiceModal}>Delete</Button>
        {/if}
    </form>
</Modal>
