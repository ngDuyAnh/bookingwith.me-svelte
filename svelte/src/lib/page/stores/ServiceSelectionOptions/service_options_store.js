import { writable } from 'svelte/store';

export const selectedServiceIds = writable(new Set());
