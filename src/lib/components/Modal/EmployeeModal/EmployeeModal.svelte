<script>
    import {Button, Checkbox, Input, Label, Modal} from "flowbite-svelte";
    import {
        employeeModal, handleDeleteEditEmployeeModal,
        handleSaveEditEmployeeModal
    } from "$lib/components/Modal/EmployeeModal/stores/employeeModal.js";
</script>

<Modal bind:open={$employeeModal.open} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={() => {}}>

        {#if $employeeModal.createEmployeeFlag}
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create employee</h3>
        {:else}
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit employee</h3>
        {/if}

        <Label class="space-y-2">
            <span>Employee Name</span>
            <Input bind:value={$employeeModal.clonedEmployee.employeeName} required />
        </Label>

        <Label class="space-y-2">
            <span>Employee Email:</span>
            <Input bind:value={$employeeModal.clonedEmployee.user.email} required />
        </Label>

        <Label class="space-y-2">
            <Checkbox bind:checked={$employeeModal.clonedEmployee.showOnlineBookingPage}>
                Show on booking page
            </Checkbox>
        </Label>

        {#if $employeeModal.createEmployeeFlag}
            <Button class="w-full" on:click={handleSaveEditEmployeeModal}>Add</Button>
        {:else}
            <Button class="w-full" on:click={handleSaveEditEmployeeModal}>Update</Button>
            <Button class="w-full" on:click={handleDeleteEditEmployeeModal}>Delete</Button>
        {/if}
    </form>
</Modal>
