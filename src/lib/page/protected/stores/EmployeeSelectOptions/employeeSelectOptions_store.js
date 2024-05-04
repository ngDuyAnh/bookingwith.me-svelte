import { writable } from 'svelte/store';

export function employeeToSelectOption(employee) {
    return {
        value: employee.id,
        name: employee.employeeName,
        data: employee  // Holding the full employee object
    };
}

export const employeeSelectOptions = writable([]);
