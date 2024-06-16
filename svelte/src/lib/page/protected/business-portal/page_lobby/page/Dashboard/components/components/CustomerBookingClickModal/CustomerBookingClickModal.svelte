<script>
    import {Modal} from "flowbite-svelte";
    import {
        CustomerBookingState
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        customerBookingClickModal
    } from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import AppointmentModalComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Appointment/AppointmentModalComponent.svelte";
    import LobbyModalComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Lobby/LobbyModalComponent.svelte";
    import ServicingModalComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Servicing/ServicingModalComponent.svelte";
    import CompletedModalComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Completed/CompletedModalComponent.svelte";
</script>

<div class="absolute top-0 left-0 right-0">
    <Modal bind:open={$customerBookingClickModal.open} size="md" outsideclose>
        {#if $customerBookingClickModal.customerBooking.bookingState === CustomerBookingState.APPOINTMENT}
            <AppointmentModalComponent/>
        {:else if $customerBookingClickModal.customerBooking.bookingState === CustomerBookingState.LOBBY}
            <LobbyModalComponent/>
        {:else if $customerBookingClickModal.customerBooking.bookingState === CustomerBookingState.SERVICING}
            <ServicingModalComponent/>
        {:else if $customerBookingClickModal.customerBooking.bookingState === CustomerBookingState.COMPLETED}
            <CompletedModalComponent/>
        {/if}
    </Modal>
</div>
