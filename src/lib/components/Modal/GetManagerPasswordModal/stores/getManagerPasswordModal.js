import {writable} from "svelte/store";

export const getManagerPasswordModal = writable({
    open: false,
});

export function handleOpenGetManagerPasswordModal()
{
    getManagerPasswordModal.set({
        open: true
    });
}

export function handleCloseGetManagerPasswordModal()
{
    getManagerPasswordModal.set({
        open: false
    });
}
