
export function employeeToSelectOption(employee) {
    return {
        value: employee.id,
        name: employee.employeeName,
        data: employee // holding the full employee object
    };
}
