<script>
    import {Modal} from "flowbite-svelte";
    import {
        CustomerBookingState
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions/CustomerBooking.js";
    import {
        customerBookingClickModal
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import AppointmentModalComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Appointment/AppointmentModalComponent.svelte";

    let customerBooking = undefined;
    $: customerBooking = $customerBookingClickModal.customerBooking;
</script>

<div class="absolute top-0 left-0 right-0">
    <Modal bind:open={$customerBookingClickModal.open} size="md" outsideclose>
        {#if customerBooking.bookingState === CustomerBookingState.APPOINTMENT}
            <AppointmentModalComponent/>
        {:else if customerBooking.bookingState === CustomerBookingState.LOBBY}
            Lobby
        {:else if customerBooking.bookingState === CustomerBookingState.SERVICING}
            Servicing
        {:else if customerBooking.bookingState === CustomerBookingState.COMPLETED}
            Completed
        {/if}
    </Modal>
</div>
