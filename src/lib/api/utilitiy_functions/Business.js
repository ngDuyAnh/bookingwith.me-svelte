
export function findEmployeeFromBusiness(business, employee)
{
    for (let employeeFromBusiness of business.employeeList) {
        if (employeeFromBusiness.id === employee.id)
        {
            return employeeFromBusiness;
        }
    }
    return null;
}
