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
            <Input bind:value={$employeeModal.employee.employeeName} required />
        </Label>

        <Label class="space-y-2">
            <span>Phone Number:</span>
            <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="1234567890"
                    bind:value={$employeeModal.employee.phoneNumber}
                    pattern="\d\d\d\d\d\d\d\d\d\d"
                    title="Phone number must be 10 numbers in the format: 1234567890"
            />
        </Label>

        <Label class="space-y-2">
            <span>Employee Email:</span>
            <Input bind:value={$employeeModal.employee.user.email}/>
        </Label>

        <Label class="space-y-2">
            <Checkbox bind:checked={$employeeModal.employee.showOnlineBookingPage}>
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
