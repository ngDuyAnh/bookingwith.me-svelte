import { writable } from 'svelte/store';

export const userProfile = writable({
    auth: undefined,
    user: undefined
});

/*
function logout() {
    user.set(null); // Reset the store
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userProfile'); // Clear sessionStorage
    }
}
*/
