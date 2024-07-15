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
        handleOpenCreateNewEmployeeModal,
        handleOpenEditEmployeeModal
    } from "$lib/components/Modal/EmployeeModal/stores/employeeModal.js";
    import {
        handleOpenEmployeeWorkScheduleModal
    } from "$lib/components/Modal/EmployeeWorkScheduleModal/stores/employeeWorkScheduleModal.js";
    import EmployeeWorkScheduleModal
        from "$lib/components/Modal/EmployeeWorkScheduleModal/EmployeeWorkScheduleModal.svelte";

    let newEmployeeName = "";
    let newEmployeeEmail = "";
    let formModalAddEmployee = false;

    let editingEmployee = {};
    let editingCloneEmployee = {};
    let formModalEditEmployee = false;


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
