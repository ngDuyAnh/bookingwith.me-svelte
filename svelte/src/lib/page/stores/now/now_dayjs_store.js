import { writable } from 'svelte/store';
import dayjs from 'dayjs';

export const now = writable(dayjs());

// Update the `now` store
setInterval(() => {
    now.set(dayjs());
}, 60000);

//export const now = writable(dayjs('2024-05-08T17:30'));
