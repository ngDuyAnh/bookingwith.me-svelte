import {get, writable} from 'svelte/store';
import {now} from "$lib/page/stores/now/now_dayjs_store.js";

export const business = writable(undefined);

export function getEmployee(id)
{
    const businessValue = get(now);

    if (businessValue && businessValue.employeeList) {
        return businessValue.employeeList.find(employee => employee.id === id);
    }
    return null;
}
