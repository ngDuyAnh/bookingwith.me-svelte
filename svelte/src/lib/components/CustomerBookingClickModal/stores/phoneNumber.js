import { writable } from 'svelte/store';

// State to manage visibility of phone number
export const fullPhoneNumberVisible = writable(false);

export function togglePhoneNumberVisibilityOFF() {
    fullPhoneNumberVisible.set(false);
}

export function togglePhoneNumberVisibility() {
    fullPhoneNumberVisible.update(n => !n);
}