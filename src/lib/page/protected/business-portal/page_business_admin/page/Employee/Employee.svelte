<script>
    import {Button} from 'flowbite-svelte';
    import {business} from "$lib/page/stores/business/business.js";
    import EmployeeModal from "$lib/components/Modal/EmployeeModal/EmployeeModal.svelte";
    import {
        handleOpenCreateNewEmployeeModal,
        handleOpenEditEmployeeModal
    } from "$lib/components/Modal/EmployeeModal/stores/employeeModal.js";
    import {
        handleOpenEmployeeWorkScheduleModal
    } from "$lib/components/Modal/EmployeeWorkScheduleModal/stores/employeeWorkScheduleModal.js";
    import EmployeeWorkScheduleModal
        from "$lib/components/Modal/EmployeeWorkScheduleModal/EmployeeWorkScheduleModal.svelte";
</script>

<ul class="employee-list">
    {#each $business.employeeList as employee (employee.id)}
        <li class="list-item">
            <div class="flex items-center justify-between p-4 bg-white shadow hover:shadow-md transition-shadow duration-200 ease-in-out rounded-lg mb-2">
                <span class="text-gray-800 font-medium">{employee.employeeName}</span>
                <div class="flex items-center space-x-2">
                    <Button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" on:click={() => handleOpenEmployeeWorkScheduleModal(employee)}>Schedule</Button>
                    <Button class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" on:click={() => handleOpenEditEmployeeModal(employee)}>Edit</Button>
                </div>
            </div>
        </li>
    {/each}
</ul>

<Button on:click={() => handleOpenCreateNewEmployeeModal()}>Add Employee</Button>


<!-- Modal for creating or editing employee -->
<EmployeeModal/>

<!-- Modal for editing employee work schedule -->
<EmployeeWorkScheduleModal/>


<style>
    .employee-list {
        list-style: none;
        padding: 0;
    }
    .list-item {
        border-bottom: 1px solid #ccc;
    }
    .list-item:last-child {
        border-bottom: none;
    }
    .list-item:hover {
        background-color: #f5f5f5; /* Light gray background on hover */
    }
</style>
