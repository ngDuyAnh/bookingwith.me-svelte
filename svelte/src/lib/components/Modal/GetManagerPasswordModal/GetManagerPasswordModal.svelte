<script>
    import {Modal, Button, Input, Label} from "flowbite-svelte";
    import {
        grantManagerAccess
    } from "$lib/components/Modal/CustomerBookingClickModal/stores/managerAccess.js";

    export let open = false;
    let managerPassword = "";

    function handlePasswordSubmit() {
        grantManagerAccess(managerPassword);

        // Reset
        managerPassword = "";
    }
</script>

<Modal bind:open={open} size="sm" autoclose outsideclose>
    <div class="flex flex-col space-y-4 p-4">
        <h3 class="text-lg font-semibold">Enter Manager Password</h3>
        <div class="flex flex-col space-y-2">
            <Label for="password" class="font-bold mb-1">Password</Label>
            <Input type="password" id="password" bind:value={managerPassword} placeholder="•••••••••" required
                   class="p-2 border rounded border-gray-300"/>
        </div>
        <div class="flex justify-end space-x-2">
            <Button color="blue" on:click={handlePasswordSubmit}>Submit</Button>
        </div>
    </div>
</Modal>
