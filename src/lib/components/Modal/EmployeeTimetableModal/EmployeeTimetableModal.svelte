<script>
    import {Button, Input, Modal} from "flowbite-svelte";
    import Select from "svelte-select";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        employeeTimetableModal,
        handleSelectEmployeeForEmployeeTimetableModal,
        handleStartTimeChangeForBlockTimePeriodEmployeeTimetableModal,
        handleEndTimeChangeForEmployeeTimetableModal,
        handleAddBlockTicket,
        handleSaveEmployeeWorkScheduleException
    } from "$lib/components/Modal/EmployeeTimetableModal/stores/employeeTimetableModal.js";

    export let allowWorkScheduleChange = true;

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

    function handleStartTimeChange(event) {
        const newStartTime = event.target.value;
        handleStartTimeChangeForBlockTimePeriodEmployeeTimetableModal(newStartTime);
    }

    function handleEndTimeChange(event) {
        const newEndTime = event.target.value;
        handleEndTimeChangeForEmployeeTimetableModal(newEndTime);
    }

    // $: console.log("$employeeTimetableModal", $employeeTimetableModal);
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$employeeTimetableModal.open} size="sm" outsideclose>
        <form class="flex flex-col space-y-4 p-4" on:submit|preventDefault={() => {}}>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Edit timetable
                {#if $employeeTimetableModal.employee?.employeeName}
                    for {$employeeTimetableModal.employee.employeeName}
                {/if}
            </h3>

            <div class="space-y-2">

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

                <!--Work schedule-->
                {#if allowWorkScheduleChange && $employeeTimetableModal.showWorkSchedule}
                    <div class="flex items-center space-x-2">
                        <!-- Container for inputs to ensure they split space evenly -->
                        <div class="flex flex-1 space-x-2">
                            <!-- Get the work schedule time -->
                            <Input type="time"
                                   class="border border-gray-300 rounded-md p-2 text-gray-700"
                                   bind:value={$employeeTimetableModal.workScheduleTimePeriod.startTime}
                                   on:change={handleStartTimeChange}
                                   placeholder="Start Time"/>
                            <Input type="time"
                                   class="border border-gray-300 rounded-md p-2 text-gray-700"
                                   bind:value={$employeeTimetableModal.workScheduleTimePeriod.endTime}
                                   on:change={handleEndTimeChange}
                                   placeholder="End Time"/>
                        </div>

                        <div class="flex flex-1">
                            <Button class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded shadow-lg hover:shadow transition-shadow duration-150"
                                    on:click={handleSaveEmployeeWorkScheduleException}>
                                Save work schedule
                            </Button>
                        </div>
                    </div>
                {/if}

                <!--Block time period-->
                {#if $employeeTimetableModal.showBlockTimePeriod}
                    <div class="flex flow-row items-center space-x-2">
                        <!-- Container for inputs to ensure they split space evenly -->
                        <div class="flex flex-1 space-x-2">
                            <!--Get the time period-->
                            <Input type="time"
                                   class="border border-gray-300 rounded-md p-2 text-gray-700"
                                   bind:value={$employeeTimetableModal.blockTimePeriod.startTime}
                                   on:change={handleStartTimeChange}
                                   placeholder="Start Time"/>
                            <Input type="time"
                                   class="border border-gray-300 rounded-md p-2 text-gray-700"
                                   bind:value={$employeeTimetableModal.blockTimePeriod.endTime}
                                   on:change={handleEndTimeChange}
                                   placeholder="End Time"/>
                        </div>

                        <div class="flex flex-1">
                            <Button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded shadow-lg hover:shadow transition-shadow duration-150"
                                    on:click={handleAddBlockTicket}>
                                Add new block time
                            </Button>
                        </div>
                    </div>
                {/if}

            </div>
        </form>
    </Modal>
</div>
