<script>
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import Appointment
        from "$lib/page/customer-booking-portal/get/page/Today/components/Appointment/Appointment.svelte";
    import Lobby from "$lib/page/customer-booking-portal/get/page/Today/components/Lobby/Lobby.svelte";
    import Servicing from "$lib/page/customer-booking-portal/get/page/Today/components/Servicing/Servicing.svelte";
    import Completed from "$lib/page/customer-booking-portal/get/page/Today/components/Completed/Completed.svelte";
    import {business} from "$lib/page/stores/business/business.js";
    import {BusinessScheduleManagement} from "$lib/api/initialize_functions/Business.js";
    import AppointmentNoneScheduleManagement
        from "$lib/page/customer-booking-portal/get/page/Today/components/NoneScheduleManagement/AppointmentNoneScheduleManagement/AppointmentNoneScheduleManagement.svelte";
    import LobbyNoneScheduleManagement
        from "$lib/page/customer-booking-portal/get/page/Today/components/NoneScheduleManagement/LobbyNoneScheduleManagement/LobbyNoneScheduleManagement.svelte";
    import ServicingNoneScheduleManagement
        from "$lib/page/customer-booking-portal/get/page/Today/components/NoneScheduleManagement/ServicingNoneScheduleManagement/ServicingNoneScheduleManagement.svelte";
    import {customerBooking} from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
</script>

<!--When customer booking is deleted, still allow review-->
{#if $customerBooking.deleted}
    <Completed/>
{:else if $customerBooking.bookingState === CustomerBookingState.APPOINTMENT}
    {#if $business.businessInfo.scheduleManagement === BusinessScheduleManagement.NONE}
        <AppointmentNoneScheduleManagement/>
    {:else}
        <Appointment/>
    {/if}
{:else if $customerBooking.bookingState === CustomerBookingState.LOBBY}
    {#if $business.businessInfo.scheduleManagement === BusinessScheduleManagement.NONE}
        <LobbyNoneScheduleManagement/>
    {:else}
        <Lobby/>
    {/if}
{:else if $customerBooking.bookingState === CustomerBookingState.SERVICING}
    {#if $business.businessInfo.scheduleManagement === BusinessScheduleManagement.NONE}
        <ServicingNoneScheduleManagement/>
    {:else}
        <Servicing/>
    {/if}
{:else if $customerBooking.bookingState === CustomerBookingState.COMPLETED}
    <Completed/>
{/if}
