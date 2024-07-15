import {get, writable} from "svelte/store";
import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
import {business} from "$lib/page/stores/business/business.js";
import {findEmployeeFromBusiness} from "$lib/api/utilitiy_functions/Business.js";
import {User} from "$lib/api/initialize_functions/User.js";
import {Employee} from "$lib/api/initialize_functions/Business.js";

export const employeeModal = writable({
    open: false,
    createEmployeeFlag: true,
    clonedEmployee: Employee()
});

export function handleOpenCreateNewEmployeeModal()
{
    employeeModal.set({
        open: true,
        createEmployeeFlag: true,
        clonedEmployee: Employee()
    });
}

export function handleOpenEditEmployeeModal(employee)
{
    // Clone the employee
    // User is null, initialize it
    employeeModal.set({
        open: true,
        createEmployeeFlag: false,
        clonedEmployee: {
            ...JSON.parse(JSON.stringify(employee)),
            user: employee.user !== null ? employee.user : User()
        }
    });
}

export function handleCloseEditEmployeeModal()
{
    employeeModal.set({
        open: false,
        createEmployeeFlag: true,
        clonedEmployee: Employee()
    });
}

export function handleSaveEditEmployeeModal()
{
    const businessValue = get(business);
    const employeeModalValue = get(employeeModal);

    console.log('Updating employee:', employeeModalValue.clonedEmployee);

    // Create new employee
    if (employeeModalValue.createEmployeeFlag)
    {
        // Add the new employee to the business
        businessValue.employeeList.push(
            employeeModalValue.clonedEmployee
        );
    }
    else
    {
        // Get the employee instance from the business
        const employee = findEmployeeFromBusiness(
            businessValue, employeeModalValue.clonedEmployee
        );

        // Deep copy to the employee instance from the business
        Object.assign(
            employee,
            employeeModalValue.clonedEmployee
        );

    }

    // Submit the business update to the server
    initializeBusiness(businessValue)
        .then(response => {
            business.set(response);
        });

    // Close the modal
    handleCloseEditEmployeeModal();
}

export function handleDeleteEditEmployeeModal()
{
    const businessValue = get(business);
    const editEmployeeModalValue = get(employeeModal);

    console.log('Deleting service:', editEmployeeModalValue.clonedEmployee);

    // Confirm deletion
    if (confirm('Are you sure you want to delete this service?')) {
        // Get the employee instance from the business
        const employee = findEmployeeFromBusiness(
            businessValue, editEmployeeModalValue.clonedEmployee
        );

        // Set the employee as archive
        employee.archive = true;

        // Request the server to update asynchronously
        initializeBusiness(businessValue)
            .then(response => {
                business.set(response);
            })

        // Close the modal
        handleCloseEditEmployeeModal();
    }
}
