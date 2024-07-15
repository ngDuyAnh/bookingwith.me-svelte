<script>
    import {Button, Modal, Label, Input} from 'flowbite-svelte';
    import {
        getEmployeeWorkSchedule,
        initializeBusiness,
        initializeEmployeeWorkSchedule
    } from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {Employee} from "$lib/api/initialize_functions/Business.js";
    import {User} from "$lib/api/initialize_functions/User.js";
    import EmployeeModal from "$lib/components/Modal/EmployeeModal/EmployeeModal.svelte";
    import {
        handleCreateNewEmployeeModal,
        handleOpenEditEmployeeModal
    } from "$lib/components/Modal/EmployeeModal/stores/employeeModal.js";

    let newEmployeeName = "";
    let newEmployeeEmail = "";
    let formModalAddEmployee = false;

    let editingEmployee = {};
    let editingCloneEmployee = {};
    let formModalEditEmployee = false;

    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let formModalEditSchedule = false;
    let editingEmployeeWorkSchedule = [];

    function openModalEditEmployee(employee) {
        if(employee.user == null)
        {
            employee.user = User();
        }
        console.log("Editing employee",employee);

        editingEmployee = employee;
        editingCloneEmployee = {...employee};


        formModalEditEmployee = true;
    }

    async function openModalEditEmployeeWorkSchedule(employee)
    {
        editingEmployee = employee;
        try
        {
            const scheduleData = await getEmployeeWorkSchedule(employee.id);

            console.log("scheduleData", scheduleData)

            // Extract the work schedule
            editingEmployeeWorkSchedule = dayOfWeek.map(day => {
                const dayToUpper = day.toUpperCase();
                const activeDay = scheduleData.workScheduleList.find(d => d.dayOfWeek.toUpperCase() === dayToUpper);
                return {
                    dayOfWeek: day,
                    startTime: activeDay ? activeDay.startTime : '',
                    endTime: activeDay ? activeDay.endTime : '',
                    isActive: !!activeDay
                };
            });
        }
        catch (error)
        {
            alert(error);
        }

        // Open the modal
        formModalEditSchedule = true;
    }

    async function openModalEditEmployeeWorkScheduleException(employee)
    {
        editingEmployee = employee;
        try
        {
            const scheduleData = await getEmployeeWorkSchedule(employee.id);

            console.log("scheduleData", scheduleData)

            // Extract the work schedule
            editingEmployeeWorkSchedule = dayOfWeek.map(day => {
                const dayToUpper = day.toUpperCase();
                const activeDay = scheduleData.workScheduleList.find(d => d.dayOfWeek.toUpperCase() === dayToUpper);
                return {
                    dayOfWeek: day,
                    startTime: activeDay ? activeDay.startTime : '',
                    endTime: activeDay ? activeDay.endTime : '',
                    isActive: !!activeDay
                };
            });
        }
        catch (error)
        {
            alert(error);
        }

        // Open the modal
        formModalEditSchedule = true;
    }

    function toggleDay(dayIndex) {
        editingEmployeeWorkSchedule[dayIndex].isActive = !editingEmployeeWorkSchedule[dayIndex].isActive;
        if (!editingEmployeeWorkSchedule[dayIndex].isActive) {
            editingEmployeeWorkSchedule[dayIndex].startTime = '';
            editingEmployeeWorkSchedule[dayIndex].endTime = '';
        }
    }

    async function handleEditEmployeeWorkSchedule()
    {
        console.log('Updating employee work schedule:', editingEmployeeWorkSchedule);

        // Prepare the work schedule list for JSON
        const workScheduleList = editingEmployeeWorkSchedule
            .filter(schedule =>
                schedule.isActive && schedule.startTime && schedule.endTime && schedule.startTime <= schedule.endTime)
            .map(schedule => ({
                "dayOfWeek": schedule.dayOfWeek.toUpperCase(),
                "startTime": schedule.startTime.substring(0, 5) || null,  // Ensure null instead of empty string if not set
                "endTime": schedule.endTime.substring(0, 5) || null
            }));

        console.log("workScheduleList", workScheduleList);

        // Employee work schedule
        const employeeWorkSchedule = {
            "employee": editingEmployee,
            "workScheduleList": workScheduleList
        }

        console.log("employeeWorkSchedule", employeeWorkSchedule)

        // Request the server to update
        await initializeEmployeeWorkSchedule(employeeWorkSchedule);

        // Reset the form fields and close the modal
        editingEmployee = {};
        editingCloneEmployee = {};
    }

    async function handleAddEmployee()
    {
        console.log(`Adding new employee: ${newEmployeeName}`);

        // Create new employee
        const newEmployee = Employee();
        newEmployee.employeeName = newEmployeeName;
        newEmployee.user.email = newEmployeeEmail;

        // Add the new employee to the business
        $business.employeeList.push(newEmployee);

        // Request the server to update asynchronously
        const response = await initializeBusiness($business);
        business.set(response);

        // Reset the form fields and close the modal
        newEmployeeName = "";
        newEmployeeEmail = "";
    }
</script>

<ul class="employee-list">
    {#each $business.employeeList as employee (employee.id)}
        <li class="list-item">
            <div class="flex items-center justify-between p-4 bg-white shadow hover:shadow-md transition-shadow duration-200 ease-in-out rounded-lg mb-2">
                <span class="text-gray-800 font-medium">{employee.employeeName}</span>
                <div class="flex items-center space-x-2">
                    <Button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" on:click={() => openModalEditEmployeeWorkSchedule(employee)}>Schedule</Button>
                    <Button class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded" on:click={() => handleOpenEditEmployeeModal(employee)}>Edit</Button>
                </div>
            </div>
        </li>
    {/each}
</ul>

<Button on:click={() => handleCreateNewEmployeeModal()}>Add Employee</Button>

<!-- Modal for editing employee work schedule -->
<Modal bind:open={formModalEditSchedule} size="sm" autoclose outsideclose>
    <form class="flex flex-col space-y-4 p-4" on:submit|preventDefault={() => {}}>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Work Schedule for {editingEmployee.employeeName}</h3>

        <!-- Day of week work schedule edit -->
        {#each editingEmployeeWorkSchedule as schedule, index}
            <div class="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id={`day-${index}`} bind:checked={schedule.isActive} on:click={() => toggleDay(index)} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label for={`day-${index}`} class="text-sm font-medium text-gray-700">{schedule.dayOfWeek}</label>
                </div>
                <div class="flex space-x-2">
                    <Input type="time" bind:value={schedule.startTime} class="w-32" disabled={!schedule.isActive} placeholder="Start Time" />
                    <Input type="time" bind:value={schedule.endTime} class="w-32" disabled={!schedule.isActive} placeholder="End Time" />
                </div>
            </div>
        {/each}

        <Button type="submit"
                class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded shadow-lg hover:shadow transition-shadow duration-150"
                on:click={handleEditEmployeeWorkSchedule}>
            Save Changes
        </Button>
    </form>
</Modal>

<!-- Modal for creating or editing employee -->
<EmployeeModal/>


<!-- Modal for add employee -->
<Modal bind:open={formModalAddEmployee} size="xs" autoclose outsideclose>
    <form class="flex flex-col space-y-6" on:submit|preventDefault={() => {}}>
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Employee</h3>
        <Label class="space-y-2">
            <span>Employee Name:</span>
            <Input bind:value={newEmployeeName} required />
        </Label>
        <Label class="space-y-2">
            <span>Employee Email:</span>
            <Input bind:value={newEmployeeEmail} required />
        </Label>
        <Button class="w-full" type="submit" on:click={handleAddEmployee}>Add</Button>
    </form>
</Modal>

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
