<script>
  import Appointment
    from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Appointment/Appointment.svelte";
  import Lobby from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Lobby/Lobby.svelte";
  import Servicing
    from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/Servicing.svelte";
  import Completed
    from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Completed/Completed.svelte";
  import CustomerBookingClickModal
    from "$lib/components/CustomerBookingClickModal/CustomerBookingClickModal.svelte";
</script>

<div class="flex flex-row w-screen h-screen justify-between 2xl:items-center 2xl:justify-center space-x-4 overflow-x-auto p-4">
  <Appointment/>
  <Lobby/>
  <Servicing/>
  <Completed/>
</div>

<!-- Modal for customer booking click -->
<CustomerBookingClickModal/>