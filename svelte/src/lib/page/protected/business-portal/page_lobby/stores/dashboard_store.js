import {get, writable} from "svelte/store";

export const customerBookingQueueList = writable([[],[],[],[]]);

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
