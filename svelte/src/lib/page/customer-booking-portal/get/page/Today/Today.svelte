<script>
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import Appointment
        from "$lib/page/customer-booking-portal/get/page/Today/components/Appointment/Appointment.svelte";
    import Lobby from "$lib/page/customer-booking-portal/get/page/Today/components/Lobby/Lobby.svelte";
    import Servicing from "$lib/page/customer-booking-portal/get/page/Today/components/Servicing/Servicing.svelte";
    import Completed from "$lib/page/customer-booking-portal/get/page/Today/components/Completed/Completed.svelte";
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
</script>

{#if $bookingEstimate.customerBooking.bookingState === CustomerBookingState.APPOINTMENT}
    <Appointment/>
{:else if $bookingEstimate.customerBooking.bookingState === CustomerBookingState.LOBBY}
    <Lobby/>
{:else if $bookingEstimate.customerBooking.bookingState === CustomerBookingState.SERVICING}
    <Servicing/>
{:else if $bookingEstimate.customerBooking.bookingState === CustomerBookingState.COMPLETED}
    <Completed/>
{/if}
