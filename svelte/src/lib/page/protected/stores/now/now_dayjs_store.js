import { writable } from 'svelte/store';
import dayjs from 'dayjs';

export const now = writable(dayjs());

// Update the `now` store
setInterval(() => {
    now.set(dayjs());
}, 60000);
