<script>
    import {Modal, Button, Input, Label} from "flowbite-svelte";
    import {
        grantManagerAccess
    } from "$lib/components/Modal/GetManagerPasswordModal/stores/managerAccess.js";
    import {
        getManagerPasswordModal
    } from "$lib/components/Modal/GetManagerPasswordModal/stores/getManagerPasswordModal.js";
    import {onMount} from "svelte";

    let managerPassword = "";

    function handlePasswordSubmit() {
        grantManagerAccess(managerPassword);

        // Reset
        managerPassword = "";
    }

    let username = "";

    let elm;

    onMount(()=> {
        const inputElement = document.getElementById('password');
        if (inputElement) {
            inputElement.focus();
        } else {
            console.error('Input element not found');
        }
    });

</script>

<div class="absolute top-0 left-0 z-[2000]">
    <Modal bind:open={$getManagerPasswordModal.open} size="sm" outsideclose>
        <form class="flex flex-col space-y-4 p-4"
              on:submit={() => {}}
        >
            <h3 class="select-none text-lg font-semibold">Enter Manager Password</h3>
            <input type="text" bind:value={username} style="display: none;" autocomplete="username">
            <div class="select-none flex flex-col space-y-2">

                <Label for="password" class="font-bold mb-1">Password</Label>
                <Input type="password" id="password" bind:value={managerPassword} placeholder="•••••••••" required
                       class="p-2 border rounded border-gray-300" bind:this={elm}
                       autocomplete="new-password"

                />
            </div>
            <div class="select-none flex justify-end">
                <Button type="submit" on:click={handlePasswordSubmit}>Submit</Button>
            </div>
        </form>
    </Modal>
</div>
