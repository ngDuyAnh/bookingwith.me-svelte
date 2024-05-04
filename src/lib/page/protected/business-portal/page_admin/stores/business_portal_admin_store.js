import { writable } from 'svelte/store';

export const businessInfo = writable({
    business: {},
    serviceGroupList: [],
    employeeList: []
});
