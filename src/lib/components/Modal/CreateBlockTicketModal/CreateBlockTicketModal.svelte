<script>
    import {Modal} from "flowbite-svelte";
    import Select from "svelte-select";
    import {
        createBlockTicketModal
    } from "$lib/components/Modal/CreateBlockTicketModal/stores/createBlockTicketModal.js";
</script>

<div class="absolute top-0 left-0 right-0 z-[2000]">
    <Modal bind:open={$createBlockTicketModal.open} size="sm" autoclose outsideclose>
        <form class="flex flex-col space-y-4 p-4" on:submit|preventDefault={() => {}}>

            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add block ticket
                {#if $createBlockTicketModal.blockTicket.employee}
                    for {$createBlockTicketModal.blockTicket.employee.employeeName}
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
