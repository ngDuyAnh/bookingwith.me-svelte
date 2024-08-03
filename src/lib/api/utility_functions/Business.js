
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

export function findEmployeeFromBusinessUsingEmail(business, email) {
    for (let employeeFromBusiness of business.employeeList) {
        if (employeeFromBusiness.user?.email === email) {
            return employeeFromBusiness;
        }
    }
    return null;
}

export function findServiceGroupFromBusiness(business, serviceGroup) {
    return findServiceGroupFromBusinessUsingID(business, serviceGroup.id);
}

export function findServiceGroupFromBusinessUsingID(business, serviceGroupID) {
    for (let serviceGroupFromBusiness of business.serviceGroupList) {
        if (serviceGroupFromBusiness.id === parseInt(serviceGroupID, 10)) {
            return serviceGroupFromBusiness;
        }
    }
    return null;
}

export function findServiceFromBusiness(business, service) {
    return findServiceFromBusinessUsingID(business, service.id);
}

export function findServiceFromBusinessUsingID(business, serviceID) {
    for (let serviceGroup of business.serviceGroupList) {
        for (let serviceFromGroup of serviceGroup.serviceList) {
            if (serviceFromGroup.id === parseInt(serviceID, 10)) {
                return serviceFromGroup;
            }
        }
    }
    return null;
}
