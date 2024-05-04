import { writable } from 'svelte/store';

export const user = writable( {
    businessId: "",
    access: ""
});

export function initializeUserFromSession() {
    if (typeof window !== 'undefined') {
        const sessionData = sessionStorage.getItem('userProfile');
        if (sessionData) {
            try {
                const parsedData = JSON.parse(sessionData);
                user.set(parsedData);
            } catch (error) {
                console.error("Failed to parse user profile:", error);
                // Optionally set user to a default state or handle the error as needed
                user.set({ businessId: "", access: "" });
            }
        } else {
            // Optionally handle the case where no session data is found
            user.set({ businessId: "", access: "" });
        }
    }
}

/*
function logout() {
    user.set(null); // Reset the store
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userProfile'); // Clear sessionStorage
    }
}
*/
