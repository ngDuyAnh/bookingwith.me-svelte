<script>
    import {Button, Input, Modal} from "flowbite-svelte";
    import Select from "svelte-select";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        employeeTimetableModal,
        handleAddBlockTicket,
        handleSaveEmployeeWorkScheduleException,
        handleSelectEmployeeForEmployeeTimetableModal,
        handleStartTimeChangeForBlockTimePeriodEmployeeTimetableModal
    } from "$lib/components/Modal/EmployeeTimetableModal/stores/employeeTimetableModal.js";

    export let selectedDate;
    export let ableToChangeEmployeeWorkSchedule = true;

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
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$employeeTimetableModal.open} size="sm" outsideclose>
        <form class="flex flex-col space-y-4 p-4" on:submit|preventDefault={() => {}}>

            <div class="mb-2">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white ">
                    Edit timetable for {selectedDate}
                    <!--{#if $employeeTimetableModal.employee?.employeeName}-->
                    <!--    Employee for {$employeeTimetableModal.employee.employeeName}-->
                    <!--{/if}-->
                </h3>
                <!--            <h3 class="text-md text-gray-900 dark:text-white">-->
                <!--                {#if $employeeTimetableModal.employee?.employeeName}-->
                <!--                     {$employeeTimetableModal.employee.employeeName}-->
                <!--                {/if}-->
                <!--            </h3>-->
            </div>

            <div class="space-y-2">

                <!--Get the employee-->
                <div class="flex flex-row justify-center items-center">
                    <span>Employee:</span>
                    <Select
                            placeholder="Please select employee"
                            --font-size="0.9rem"
                            floatingConfig={{strategy: 'fixed',}}
                            --multi-max-width="fit"

                            --list-border="1px solid #006fe8"


                            items={employeeSelectOptions} clearable={false}
                            value={selectedEmployee}
                            on:change={handleEmployeeSelect}
                    />
                </div>

                <div class="border-2 rounded-lg ">
                    <!--Work schedule-->
                    {#if ableToChangeEmployeeWorkSchedule}
                        <div class="flex sm:items-center sm:space-x-2 sm:space-y-0 space-y-1 sm:flex-row flex-col p-1">
                            <!-- Container for inputs to ensure they split space evenly -->
                            <div class="flex flex-1 space-x-2">
                                <!-- Get the work schedule time -->
                                <Input type="time"
                                       class="border border-gray-300 rounded-md p-2 text-gray-700"
                                       bind:value={$employeeTimetableModal.workScheduleTimePeriod.startTime}
                                       placeholder="Start Time"/>
                                <Input type="time"
                                       class="border border-gray-300 rounded-md p-2 text-gray-700"
                                       bind:value={$employeeTimetableModal.workScheduleTimePeriod.endTime}
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
                        <hr/>
                        <div class="flex sm:items-center sm:space-x-2 sm:space-y-0 space-y-1 sm:flex-row flex-col p-1">
                            <!-- Container for inputs to ensure they split space evenly -->
                            <div class="flex flex-1 space-x-2">
                                <!--Get the time period-->
                                <Input type="time"
                                       class="border border-gray-300 rounded-md p-2 text-gray-700"
                                       bind:value={$employeeTimetableModal.blockTimePeriod.startTime}
                                       on:change={handleStartTimeChangeForBlockTimePeriodEmployeeTimetableModal}
                                       placeholder="Start Time"/>
                                <Input type="time"
                                       class="border border-gray-300 rounded-md p-2 text-gray-700"
                                       bind:value={$employeeTimetableModal.blockTimePeriod.endTime}
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

            </div>
        </form>
    </Modal>
</div>

<style>
    hr {
        display: block;
        height: 1px;
        border: 0;
        border: 1px solid #e5e7eb;
        margin: 5px 0;
        padding: 0;
    }
</style>