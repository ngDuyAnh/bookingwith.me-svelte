
export function shortCustomerBookingID(id)
{
    return (id % 1000).toString().padStart(3, '0');
}

export function sanitizeCustomerBooking(customerBooking) {
    // Filter out individual bookings that have an empty service booking list
    customerBooking.customerIndividualBookingList = customerBooking.customerIndividualBookingList.filter(individualBooking => {
        return individualBooking.customerIndividualServiceBookingList.length > 0;
    });

    return customerBooking;
}

export function findIndividualBookingFromCustomerBooking(customerBooking, individualID)
{
    for (let individualBooking of customerBooking.customerIndividualBookingList) {
        if (individualBooking.individualID === individualID)
        {
            return individualBooking;
        }
    }
    return null;
}

export function findServiceBookingFromIndividualBooking(individualBooking, serviceBookingID)
{
    for (let serviceBooking of individualBooking.customerIndividualServiceBookingList)
    {
        if (serviceBooking.serviceBookingID === serviceBookingID)
        {
            return serviceBooking;
        }
    }
    return null;
}

export function findServiceBookingFromCustomerBooking(customerBooking, serviceBookingID) {
    for (let individualBooking of customerBooking.customerIndividualBookingList) {
        let serviceBooking = findServiceBookingFromIndividualBooking(individualBooking, serviceBookingID);
        if (serviceBooking !== null) {
            return serviceBooking;
        }
    }
    return null;
}

export function getServiceBookingListFromCustomerBooking(customerBooking) {
    // Initialize an empty array to hold all service bookings
    let allServiceBookings = [];

    // Loop through each individual booking in the customer booking
    customerBooking.customerIndividualBookingList.forEach(individualBooking => {
        // Add all service bookings from the individual booking to the overall list
        allServiceBookings = allServiceBookings.concat(individualBooking.customerIndividualServiceBookingList);
    });

    // Return the array of all service bookings
    return allServiceBookings;
}

export function getServiceBookingListWithBookedEmployeeFromCustomerBooking(customerBooking)
{
    // Get the service booking list
    let serviceBookingList = getServiceBookingListFromCustomerBooking(customerBooking);

    // Filter the list to only include service bookings with a bookedEmployee
    return serviceBookingList.filter(serviceBooking => serviceBooking.bookedEmployee);
}

export function groupServiceBookingsByEmployee(serviceBookingList) {
    const groupedBookings = {};

    serviceBookingList.forEach(booking => {
        // Assume each booking has a bookedEmployee object with an id and other details
        const employeeId = booking.bookedEmployee?.id;
        if (employeeId) {
            if (!groupedBookings[employeeId]) {
                groupedBookings[employeeId] = [];  // Initialize the array if not already initialized
            }
            groupedBookings[employeeId].push(booking);  // Add the booking to the correct group
        }
    });

    return groupedBookings;
}

export function customerBookingSubtotal(customerBooking)
{
    let subtotal = 0;
    if(customerBooking) {
        customerBooking.customerIndividualBookingList.forEach(individualBooking => {
            individualBooking.customerIndividualServiceBookingList.forEach(serviceBooking => {
                subtotal += serviceBookingCost(serviceBooking);
            });
        });
    }

    // Return
    return subtotal;
}

export function serviceBookingCost(serviceBooking)
{
    let cost = serviceBooking.service.serviceCost;
    if (serviceBooking.serviceCostAdjusted)
    {
        cost = serviceBooking.serviceCostAdjusted;
    }

    // Return
    return cost;
}

export function getEmployeeTips(customerBookingList, employee)
{
    let totalTips = 0;
    customerBookingList.forEach(customerBooking => {
        // Get the transaction
        const transaction = customerBooking.transaction;

        // Determine the ratio of tips the employee
        // Right now the ratio is based on the service duration
        let totalRatio = 0;
        let employeeRatio = 0;
        customerBooking.customerIndividualBookingList.forEach(individualBooking => {
            individualBooking.customerIndividualServiceBookingList.forEach(serviceBooking => {

                const timeLength = serviceBooking.service.serviceTimeLength;

                totalRatio += timeLength;

                // It is the targeted employee
                if (serviceBooking.assignedEmployee.id === employee.id)
                {
                    employeeRatio += timeLength;
                }
            });
        });

        // console.log(`${transaction.tip} * ${employeeRatio} / ${totalRatio}`)

        // Add the tip
        totalTips += transaction.tip * (employeeRatio / totalRatio);
    });

    // Return
    return totalTips;
}
