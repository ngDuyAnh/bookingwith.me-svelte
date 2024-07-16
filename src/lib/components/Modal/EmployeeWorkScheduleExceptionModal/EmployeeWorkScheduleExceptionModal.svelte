<script>
    import {Button, Input, Modal} from "flowbite-svelte";
    import {
        employeeWorkScheduleExceptionModal,
        handleSaveEmployeeWorkScheduleExceptionModal,
        handleSelectEmployeeForEmployeeWorkScheduleExceptionModal
    } from "$lib/components/Modal/EmployeeWorkScheduleExceptionModal/stores/employeeWorkScheduleExceptionModal.js";
    import Select from "svelte-select";
    import {business} from "$lib/page/stores/business/business.js";

    const employeeSelectOptions = $business.employeeList.map(employee => ({
        label: employee.employeeName,
        value: employee
    }));

    $: selectedEmployee = employeeSelectOptions
        .find(option => option.value?.id === $employeeWorkScheduleExceptionModal.employee?.id);

    function handleEmployeeSelect(event)
    {
        let newEmployee = event.detail.value;

        handleSelectEmployeeForEmployeeWorkScheduleExceptionModal(newEmployee);
    }
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$employeeWorkScheduleExceptionModal.open} size="sm" autoclose outsideclose>
        <form class="flex flex-col space-y-4 p-4" on:submit|preventDefault={() => {}}>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Edit work schedule
                {#if $employeeWorkScheduleExceptionModal.employee?.employeeName}
                    for {$employeeWorkScheduleExceptionModal.employee.employeeName}
                {/if}
            </h3>

            <div class="flex space-x-2">
                <!--Get the employee-->
                <Select
                        --font-size="0.9rem"
                        floatingConfig={{strategy: 'fixed',}}
                        --multi-max-width="fit"

                        --list-border="1px solid #006fe8"


                        items={employeeSelectOptions} clearable={false}
                        value={selectedEmployee}
                        on:change={handleEmployeeSelect}
                />

                <!--Get the work schedule time-->
                <Input type="time"
                       bind:value={$employeeWorkScheduleExceptionModal.workScheduleTimePeriod.startTime} class="w-32"
                       placeholder="Start Time"/>
                <Input type="time"
                       bind:value={$employeeWorkScheduleExceptionModal.workScheduleTimePeriod.endTime} class="w-32"
                       placeholder="End Time"/>
            </div>

            <Button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded shadow-lg hover:shadow transition-shadow duration-150"
                    on:click={handleSaveEmployeeWorkScheduleExceptionModal}>
                Save Changes
            </Button>
        </form>
    </Modal>
</div>