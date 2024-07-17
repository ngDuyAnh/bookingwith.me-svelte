<script>
    import {Button, Input, Modal} from "flowbite-svelte";
    import Select from "svelte-select";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        employeeTimetableModal,
        handleSelectEmployeeForEmployeeTimetableModal,
        handleStartTimeChangeForEmployeeTimetableModal,
        handleEndTimeChangeForEmployeeTimetableModal,
        handleAddBlockTicket,
        handleSaveEmployeeWorkScheduleException
    } from "$lib/components/Modal/EmployeeTimetableModal/stores/employeeTimetableModal.js";

    const employeeSelectOptions = $business.employeeList.map(employee => ({
        label: employee.employeeName,
        value: employee
    }));

    $: selectedEmployee = employeeSelectOptions
        .find(option => option.value?.id === $employeeTimetableModal.employee?.id);

    function handleEmployeeSelect(event) {
        let newEmployee = event.detail.value;
        handleSelectEmployeeForEmployeeTimetableModal(newEmployee);
    }

    function handleStartTimeChange(event)
    {
        const newStartTime = event.target.value;
        handleStartTimeChangeForEmployeeTimetableModal(newStartTime);
    }

    function handleEndTimeChange(event)
    {
        const newEndTime = event.target.value;
        handleEndTimeChangeForEmployeeTimetableModal(newEndTime);
    }

    // $: console.log("$employeeTimetableModal", $employeeTimetableModal);
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$employeeTimetableModal.open} size="sm" autoclose outsideclose>
        <form class="flex flex-col space-y-4 p-4" on:submit|preventDefault={() => {}}>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Edit timetable
                {#if $employeeTimetableModal.employee?.employeeName}
                    for {$employeeTimetableModal.employee.employeeName}
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
                       bind:value={$employeeTimetableModal.timePeriod.startTime}
                       on:change={handleStartTimeChange}
                       placeholder="Start Time"/>
                <Input type="time"
                       bind:value={$employeeTimetableModal.timePeriod.endTime}
                       on:change={handleEndTimeChange}
                       placeholder="End Time"/>
            </div>

            <div class="flex space-x-2">
                <Button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded shadow-lg hover:shadow transition-shadow duration-150"
                        on:click={handleAddBlockTicket}>
                    Add new block time
                </Button>
                <Button class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded shadow-lg hover:shadow transition-shadow duration-150"
                        on:click={handleSaveEmployeeWorkScheduleException}>
                    Save work schedule
                </Button>
            </div>
        </form>
    </Modal>
</div>
