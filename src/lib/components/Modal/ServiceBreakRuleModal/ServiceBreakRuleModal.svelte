<script>
    import {Button, Input, Label, Modal} from "flowbite-svelte";
    import {serviceBreakRuleModal, handleSaveServiceBreakRuleModal} from "$lib/components/Modal/ServiceBreakRuleModal/stores/serviceBreakRuleModal.js";
    import {ServiceBreakRule} from "$lib/api/initialize_functions/Business.js";

    // Function to add a new break rule
    function addNewBreakRule() {
        $serviceBreakRuleModal.serviceBreakRuleList = [
            ...$serviceBreakRuleModal.serviceBreakRuleList,
            {
                ...ServiceBreakRule(),
            }
        ];
    }

    // Function to remove a break rule by index
    function removeBreakRule(index) {
        $serviceBreakRuleModal.serviceBreakRuleList = [
            ...$serviceBreakRuleModal.serviceBreakRuleList.slice(0, index),
            ...$serviceBreakRuleModal.serviceBreakRuleList.slice(index + 1)
        ];
    }

    $: console.log("$serviceBreakRuleModal", $serviceBreakRuleModal);
</script>

<Modal bind:open={$serviceBreakRuleModal.open} size="xs" outsideclose>
    <form
            class="flex flex-col space-y-2"
            on:submit|preventDefault={handleSaveServiceBreakRuleModal}
    >
        <!-- Service Break Rules List -->
        {#key $serviceBreakRuleModal.serviceBreakRuleList.length}
            {#each $serviceBreakRuleModal.serviceBreakRuleList as rule, index}
                <div class="flex flex-col space-y-2 border p-2 rounded">
                    {#if index === 0}
                        <Label>Initial working duration (minutes)</Label>
                    {:else}
                        <Label>Start working duration (minutes)</Label>
                    {/if}
                    <Input type="number" bind:value={rule.workingDuration} min="0"/>

                    <Label>Following free time duration (minutes)</Label>
                    <Input type="number" bind:value={rule.freeDuration} min="0"/>

                    <Button on:click={() => removeBreakRule(index)} color="red">Remove</Button>
                </div>
            {/each}
        {/key}

        <!-- Add New Break Rule Button -->
        <Button on:click={addNewBreakRule} color="blue">Add New Break Rule</Button>

        <!-- Save and Close Buttons -->
        <div class="flex justify-between">
            <Button type="submit" color="green">Save Changes</Button>
        </div>
    </form>
</Modal>
