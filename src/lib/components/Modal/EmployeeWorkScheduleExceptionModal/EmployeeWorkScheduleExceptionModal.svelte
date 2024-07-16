<script>
    import {Button, Input, Modal} from "flowbite-svelte";
    import {
        employeeWorkScheduleExceptionModal, handleSaveEmployeeWorkScheduleExceptionModal
    } from "$lib/components/Modal/EmployeeWorkScheduleExceptionModal/stores/employeeWorkScheduleExceptionModal.js";
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$employeeWorkScheduleExceptionModal.open} size="sm" autoclose outsideclose>
        <form class="flex flex-col space-y-4 p-4" on:submit|preventDefault={() => {}}>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit work schedule
                for {$employeeWorkScheduleExceptionModal.employee.employeeName}</h3>

            <div class="flex space-x-2">
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