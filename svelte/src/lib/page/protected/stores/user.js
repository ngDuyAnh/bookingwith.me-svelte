import { writable } from 'svelte/store';

export const user = writable( {
    role: ""
});

/*
function logout() {
    user.set(null); // Reset the store
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userProfile'); // Clear sessionStorage
    }
}
*/
