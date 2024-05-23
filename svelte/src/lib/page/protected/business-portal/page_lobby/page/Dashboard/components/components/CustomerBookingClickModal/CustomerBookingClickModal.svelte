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

    let customerBooking = undefined;
    $: customerBooking = $customerBookingClickModal.customerBooking;
</script>

<div class="absolute top-0 left-0 right-0">
    <Modal bind:open={$customerBookingClickModal.open} size="md" outsideclose>
        {#if customerBooking.bookingState === CustomerBookingState.APPOINTMENT}
            <AppointmentModalComponent/>
        {:else if customerBooking.bookingState === CustomerBookingState.LOBBY}
            <LobbyModalComponent/>
        {:else if customerBooking.bookingState === CustomerBookingState.SERVICING}
            <ServicingModalComponent/>
        {:else if customerBooking.bookingState === CustomerBookingState.COMPLETED}
            <CompletedModalComponent/>
        {/if}
    </Modal>
</div>
