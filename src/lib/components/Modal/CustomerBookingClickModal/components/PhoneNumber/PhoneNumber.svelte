<script>
    import {
        customerBookingClickModal
    } from "$lib/components/Modal/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {EyeOutline, EyeSlashOutline} from "flowbite-svelte-icons";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {
        disableManagerAccess,
        managerAccess
    } from "$lib/components/Modal/GetManagerPasswordModal/stores/managerAccess.js";
    import {
        handleOpenGetManagerPasswordModal
    } from "$lib/components/Modal/GetManagerPasswordModal/stores/getManagerPasswordModal.js";

    // Computed to mask/unmask phone number based on visibility state
    $: maskedPhoneNumber = $managerAccess
        ? formatPhoneNumber($customerBookingClickModal.customerBooking.customer.phoneNumber)
        : '(xxx) xxx-' + $customerBookingClickModal.customerBooking.customer.phoneNumber.slice(6);

    function handleManagerAccess() {
        // Request manager access
        if (!$managerAccess) {
            handleOpenGetManagerPasswordModal();
        }
        // Disable manager access
        else {
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
