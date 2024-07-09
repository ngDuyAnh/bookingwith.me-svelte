<script>
    import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import GuestSelectService
        from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/GuestSelectService/GuestSelectService.svelte";
    import Guest from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/Guest/Guest.svelte";

    export let customerBooking = {
        ...CustomerBooking(),
        customerIndividualBookingList: [CustomerIndividualBooking()]
    };

    export let bookingChannel;
    $: if (customerBooking.bookingChannel === -1) {
        customerBooking.bookingChannel = bookingChannel;
    }

    let selectedIndividualBookingIndex = 0;
</script>

<div class="flex space-x-4">

    <!--Guest column-->
    <div class="flex-1 flex flex-col">
        <Guest
                {customerBooking}
                bind:selectedIndividualBookingIndex={selectedIndividualBookingIndex}
        />
    </div>

    <!--Service selection for guest column-->
    <div class="flex-1 flex flex-col">
            <GuestSelectService
                    individualBooking={
                        customerBooking.customerIndividualBookingList[selectedIndividualBookingIndex]
                        }
            />
    </div>

    <div class="flex-1 flex flex-col">
        <!-- Additional content for the third column -->
        <ul class="flex-grow px-4 py-1 shadow w-full overflow-y-auto space-y-2">
            <!-- Additional list items can go here -->
        </ul>
    </div>

    <div class="flex-1 flex flex-col">
        <!-- Additional content for the fourth column -->
        <ul class="flex-grow px-4 py-1 shadow w-full overflow-y-auto space-y-2">
            <!-- Additional list items can go here -->
        </ul>
    </div>
</div>
