<script>
    import {
        customerBookingClickModal
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {EyeOutline, EyeSlashOutline} from "flowbite-svelte-icons";
    import {
        fullPhoneNumberVisible,
        togglePhoneNumberVisibility,
        togglePhoneNumberVisibilityOFF
    } from "$lib/components/CustomerBookingClickModal/stores/phoneNumber.js";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";

    togglePhoneNumberVisibilityOFF();


    // Computed to mask/unmask phone number based on visibility state
    $: maskedPhoneNumber = $fullPhoneNumberVisible
        ? formatPhoneNumber($customerBookingClickModal.customerBooking.customer.phoneNumber)
        : '(xxx) xxx-' + $customerBookingClickModal.customerBooking.customer.phoneNumber.slice(6);

</script>

<p><strong>Phone number:</strong> {maskedPhoneNumber}
    <button on:click={togglePhoneNumberVisibility}>
        {#if $fullPhoneNumberVisible}
            <EyeOutline class="inline-flex"/>
        {:else}
            <EyeSlashOutline class="inline-flex"/>
        {/if}
    </button>
</p>