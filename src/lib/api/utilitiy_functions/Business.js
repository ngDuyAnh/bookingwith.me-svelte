
export function findEmployeeFromBusiness(business, employee)
{
    return findEmployeeFromBusinessUsingEmployeeID(
        business, employee.id
    );
}

export function findEmployeeFromBusinessUsingEmployeeID(business, employeeID)
{
    for (let employeeFromBusiness of business.employeeList) {
        if (employeeFromBusiness.id === parseInt(employeeID, 10))
        {
            return employeeFromBusiness;
        }
    }
    return null;
}
