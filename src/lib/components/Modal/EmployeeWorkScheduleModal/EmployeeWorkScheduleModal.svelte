<script>
    import {Button, Input, Modal} from "flowbite-svelte";
    import {
        employeeWorkScheduleModal,
        handleSaveEmployeeWorkScheduleModal,
        handleToggleWorkScheduleDayEmployeeWorkScheduleModal
    } from "$lib/components/Modal/EmployeeWorkScheduleModal/stores/employeeWorkScheduleModal.js";

    // $: console.log("employeeWorkScheduleModal", employeeWorkScheduleModal);
</script>

<Modal bind:open={$employeeWorkScheduleModal.open} size="sm" autoclose outsideclose>
    <form class="flex flex-col space-y-4 p-4" on:submit|preventDefault={() => {}}>

        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit work schedule for {$employeeWorkScheduleModal.employee.employeeName}</h3>

        <!-- Day of week work schedule edit -->
        {#each $employeeWorkScheduleModal.workSchedule as schedule, index}
            <div class="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                <div class="flex items-center space-x-2">
                    <input
                            type="checkbox" id={`day-${index}`} bind:checked={schedule.isActive}
                            on:click={() => handleToggleWorkScheduleDayEmployeeWorkScheduleModal(index)}
                            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label for={`day-${index}`} class="text-sm font-medium text-gray-700">{schedule.dayOfWeek}</label>
                </div>
                <div class="flex space-x-2">
                    <Input type="time" bind:value={schedule.startTime} class="w-32" disabled={!schedule.isActive} placeholder="Start Time" />
                    <Input type="time" bind:value={schedule.endTime} class="w-32" disabled={!schedule.isActive} placeholder="End Time" />
                </div>
            </div>
        {/each}

        <Button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded shadow-lg hover:shadow transition-shadow duration-150"
                on:click={handleSaveEmployeeWorkScheduleModal}>
            Save Changes
        </Button>
    </form>
</Modal>
