import { writable } from 'svelte/store';

export const userProfile = writable({
    auth: null,
    user: null
});
