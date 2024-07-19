import {get, writable} from 'svelte/store';

export const business = writable(undefined);

export function getBusinessID()
{
    const businessValue = get(business);
    return businessValue.businessInfo.businessID;
}

export function getEmployee(id) {
    const businessValue = get(business);

    // Check if businessValue is defined and has an employeeList
    if (businessValue && businessValue.employeeList) {
        // Use the find method to look for the employee with the matching id
        const employee = businessValue.employeeList.find(employee => employee.id === id);

        // If an employee is found, return it; otherwise, return null explicitly
        return employee || null;
    }

    // Return null if businessValue or businessValue.employeeList is undefined
    return null;
}
