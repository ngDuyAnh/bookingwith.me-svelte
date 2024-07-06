import {get, writable} from 'svelte/store';

export const business = writable(undefined);

export function getEmployee(id)
{
    const businessValue = get(business);

    if (businessValue && businessValue.employeeList) {
        return businessValue.employeeList.find(employee => employee.id === id);
    }
    return null;
}
