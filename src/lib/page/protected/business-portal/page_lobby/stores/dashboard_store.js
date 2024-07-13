import {get, writable} from "svelte/store";
import {getCustomerBookingQueueList} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
import {business} from "$lib/page/stores/business/business.js";
import {now} from "$lib/page/stores/now/now_dayjs_store.js";
import {formatToDate} from "$lib/application/Formatter.js";
// import {
//     handleCustomerBookingClickUpdate
// } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";

import {
    handleCustomerBookingClickUpdate
} from "../../../../../components/Modal/CustomerBookingClickModal/stores/customerBookingClickModal.js";

export const customerBookingQueueList = writable([[],[],[],[]]);

export async function fetchCustomerBookingQueueList()
{
    const nowValue = get(now);
    const businessValue = get(business);

    // Get the customer booking list
    const response = await getCustomerBookingQueueList(
        businessValue.businessInfo.businessID, nowValue.format(formatToDate)
    );
    customerBookingQueueList.set(response.customerBookingQueueList);

    // Reinitialize customer booking click modal
    handleCustomerBookingClickUpdate();
}

export function findCustomerBookingById(id)
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
