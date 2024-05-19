import {writable} from "svelte/store";

export const pageIndex = writable(0);
export const customerIndividualList = writable([[]]);
export const customerBooking = writable({});