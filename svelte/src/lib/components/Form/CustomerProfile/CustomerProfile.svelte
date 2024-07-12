<script>
    import {initializeCustomerProfile} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {customerProfileModal} from "$lib/components/Modal/CustomerProfileModal/customerProfileModal.js";
    import {Button, Input, Label, Spinner, Textarea} from "flowbite-svelte";
    import {onMount} from "svelte";
    import {business} from "$lib/page/stores/business/business.js";

    export let showPhoneNumber = true;
    export let editable = true;
    export let customerProfile;

    function handleSave() {
        loading = true;
        initializeCustomerProfile($business.businessInfo.businessID, customerProfile)
            .then(() => {
                loading = false;
            })
            .catch(error => {
                alert(`Something went wrong, failed to save customer profile.`);
                console.error('Failed to save customer profile:', error);

                loading = false;
            });
    }

    let loading = true;
    onMount(async () => {
        loading = false;
    });
</script>

{#if loading}
    <div class="flex justify-center items-center h-full">
        <Spinner/>
    </div>
{:else}
    <form on:submit={handleSave} class="space-y-4">
        {#if showPhoneNumber}
            <Label class="space-y-2">
                <span>Phone Number:</span>
                <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="1234567890"
                        bind:value={$customerProfileModal.customerProfile.customer.phoneNumber}
                        required
                        pattern="\d\d\d\d\d\d\d\d\d\d"
                        title="Phone number must be 10 numbers in the format: 1234567890"

                        disabled={!editable}
                />
            </Label>
        {/if}

        <Label class="space-y-2">
            <span>Name:</span>
            <Input
                    id="customerName"
                    bind:value={$customerProfileModal.customerProfile.customer.customerName}

                    disabled={!editable}
            />
        </Label>

        <Label class="space-y-2">
            <span>Note:</span>
            <Textarea
                    id="message"
                    placeholder="Enter any note here..."
                    rows="5"
                    bind:value={$customerProfileModal.customerProfile.note}

                    disabled={!editable}
            />
        </Label>

        <Button type="submit" class="w-full">
            Save
        </Button>
    </form>
{/if}
