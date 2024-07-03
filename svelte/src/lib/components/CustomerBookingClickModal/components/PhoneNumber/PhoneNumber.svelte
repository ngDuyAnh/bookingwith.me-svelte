<script>
    import {
        customerBookingClickModal
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {EyeOutline, EyeSlashOutline} from "flowbite-svelte-icons";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {
        disableManagerAccess,
        managerAccess
    } from "$lib/components/CustomerBookingClickModal/stores/managerAccess.js";
    import GetManagerPasswordModal from "$lib/components/GetManagerPasswordModal/GetManagerPasswordModal.svelte";

    // Computed to mask/unmask phone number based on visibility state
    $: maskedPhoneNumber = $managerAccess
        ? formatPhoneNumber($customerBookingClickModal.customerBooking.customer.phoneNumber)
        : '(xxx) xxx-' + $customerBookingClickModal.customerBooking.customer.phoneNumber.slice(6);

    let openManagerAccessModal = false;
    function handleManagerAccess()
    {
        // Request manager access
        if (!$managerAccess)
        {
            openManagerAccessModal = true;
        }
        // Disable manager access
        else
        {
            disableManagerAccess();
        }
    }
</script>

<p><strong>Phone number:</strong> {maskedPhoneNumber}
    <button on:click={handleManagerAccess}>
        {#if $managerAccess}
            <EyeOutline class="inline-flex"/>
        {:else}
            <EyeSlashOutline class="inline-flex"/>
        {/if}
    </button>
</p>

<!--Grant manager access-->
<div class="absolute top-0 left-0">
    <GetManagerPasswordModal bind:open={openManagerAccessModal}/>
</div>
