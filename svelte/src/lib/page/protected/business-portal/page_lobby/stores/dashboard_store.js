import {get, writable} from "svelte/store";
import {getCustomerBookingQueueList} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
import {business} from "$lib/page/stores/business/business.js";
import {now} from "$lib/page/stores/now/now_dayjs_store.js";
import {formatToDate} from "$lib/application/Formatter.js";
import {customerBookingClickModal} from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";

export const customerBookingQueueList = writable([[],[],[],[]]);

export async function fetchCustomerBookingQueueList()
{
    const nowValue = get(now);
    const businessValue = get(business);
    const customerBookingClickModalValue = get(customerBookingClickModal);

    // Get the customer booking list
    const response = await getCustomerBookingQueueList(
        businessValue.businessInfo.businessID, nowValue.format(formatToDate)
    );
    customerBookingQueueList.set(response.customerBookingQueueList);

    // Find and reinitialize the customer booking for the modal
    if (customerBookingClickModalValue.customerBooking)
    {
        const findID = customerBookingClickModalValue.customerBooking.id;
        const foundCustomerBooking = findCustomerBookingById(findID);
        if (foundCustomerBooking) {
            customerBookingClickModal.update(current => {
                return {
                    ...current,
                    customerBooking: foundCustomerBooking
                };
            });
        } else {
            console.log('Customer booking not found for customer booking click modal.');
        }
    }

    //console.log("bookingStateList", $bookingStateList)
}

function findCustomerBookingById(id)
{
    const stateList = get(customerBookingQueueList);
    for (let i = 0; i < stateList.length; i++)
    {
        for (let j = 0; j < stateList[i].length; j++)
        {
            if (stateList[i][j].id === id) {
                return stateList[i][j];
            }
        }
    }
    return null;
}
