<script>
    import {Modal} from "flowbite-svelte";
    import {
        CustomerBookingState
    } from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        customerBookingClickModal
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import AppointmentModalComponent
        from "$lib/components/CustomerBookingClickModal/Appointment/AppointmentModalComponent.svelte";
    import LobbyModalComponent
        from "$lib/components/CustomerBookingClickModal/Lobby/LobbyModalComponent.svelte";
    import ServicingModalComponent
        from "$lib/components/CustomerBookingClickModal/Servicing/ServicingModalComponent.svelte";
    import CompletedModalComponent
        from "$lib/components/CustomerBookingClickModal/Completed/CompletedModalComponent.svelte";
    import Footer from "$lib/components/CustomerBookingClickModal/components/Footer/Footer.svelte";
</script>

<div class="absolute top-0 left-0">
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

        <!--Footer options-->
        <Footer customerBooking={$customerBookingClickModal.customerBooking}/>
    </Modal>
</div>
