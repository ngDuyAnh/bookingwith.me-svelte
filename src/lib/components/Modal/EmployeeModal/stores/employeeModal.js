import {get, writable} from "svelte/store";
import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
import {business} from "$lib/page/stores/business/business.js";
import {findEmployeeFromBusiness} from "$lib/api/utility_functions/Business.js";
import {User} from "$lib/api/initialize_functions/User.js";
import {Employee} from "$lib/api/initialize_functions/Business.js";

export const employeeModal = writable({
    open: false,
    createEmployeeFlag: true,
    employee: Employee()
});

export function handleOpenCreateNewEmployeeModal()
{
    employeeModal.set({
        open: true,
        createEmployeeFlag: true,
        employee: Employee()
    });
}

export function handleOpenEditEmployeeModal(employee)
{
    // Clone the employee
    // User is null, initialize it
    employeeModal.set({
        open: true,
        createEmployeeFlag: false,
        employee: {
            ...JSON.parse(JSON.stringify(employee)),
            user: employee.user !== null ? employee.user : User()
        }
    });
}

export function handleCloseEmployeeModal()
{
    employeeModal.set({
        open: false,
        createEmployeeFlag: true,
        employee: Employee()
    });
}

export function handleSaveEmployeeModal()
{
    const businessValue = get(business);
    const employeeModalValue = get(employeeModal);

    console.log('Updating employee:', employeeModalValue.employee);

    // Create new employee
    if (employeeModalValue.createEmployeeFlag)
    {
        // Add the new employee to the business
        businessValue.employeeList.push(
            employeeModalValue.employee
        );
    }
    // Existing
    else
    {
        // Get the employee instance from the business
        const employee = findEmployeeFromBusiness(
            businessValue, employeeModalValue.employee
        );

        // Deep copy to the employee instance from the business
        Object.assign(
            employee,
            employeeModalValue.employee
        );
    }

    // Submit the business update to the server
    initializeBusiness(businessValue)
        .then(response => {
            business.set(response);
        });

    // Close the modal
    handleCloseEmployeeModal();
}

export function handleDeleteEditEmployeeModal()
{
    const businessValue = get(business);
    const editEmployeeModalValue = get(employeeModal);

    console.log('Deleting employee:', editEmployeeModalValue.employee);

    // Confirm deletion
    if (confirm('Are you sure you want to delete this employee?')) {
        // Get the employee instance from the business
        const employee = findEmployeeFromBusiness(
            businessValue, editEmployeeModalValue.employee
        );

        // Set the employee as archive
        employee.archive = true;

        // Request the server to update asynchronously
        initializeBusiness(businessValue)
            .then(response => {
                business.set(response);
            })

        // Close the modal
        handleCloseEmployeeModal();
    }
}
