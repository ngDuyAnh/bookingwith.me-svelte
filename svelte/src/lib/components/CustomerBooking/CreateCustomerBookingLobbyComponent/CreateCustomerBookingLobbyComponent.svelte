<script>
    import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import SelectServiceBooking
        from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/GuestSelectService/components/SelectServiceBooking/SelectServiceBooking.svelte";
    import GuestSelectService
        from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/GuestSelectService/GuestSelectService.svelte";

    export let customerBooking = {
        ...CustomerBooking(),
        customerIndividualBookingList: [CustomerIndividualBooking()]
    };

    let selectedIndividualBookingIndex = 0;

    // Function to handle the creation of a new individual booking
    function createNewGuest() {
        customerBooking.customerIndividualBookingList.push(CustomerIndividualBooking());
        selectedIndividualBookingIndex = customerBooking.customerIndividualBookingList.length - 1;
    }

    // Function to handle the deletion of an individual booking
    function deleteGuest(index) {
        // Always keep at least one guest
        if (customerBooking.customerIndividualBookingList.length > 1)
        {
            if (customerBooking.customerIndividualBookingList[index].customerIndividualServiceBookingList.length === 0 ||
                confirm('Are you sure you want to delete this guest?'))
            {
                customerBooking.customerIndividualBookingList = [
                    ...customerBooking.customerIndividualBookingList.slice(0, index),
                    ...customerBooking.customerIndividualBookingList.slice(index + 1)
                ];

                if (selectedIndividualBookingIndex >= index && selectedIndividualBookingIndex > 0) {
                    selectedIndividualBookingIndex -= 1;
                }
            }
        }
    }
</script>

<div class="flex space-x-4">

    <!--Guest column-->
    <div class="flex-1 flex flex-col">
        <ul class="flex-grow px-4 py-1 shadow w-full overflow-y-auto space-y-2">
            {#each customerBooking.customerIndividualBookingList as individualBooking, index (index)}
                <li id={index} class="flex justify-between items-center p-2 bg-gray-100 rounded-md shadow-sm">
                    <button
                            on:click={() => {selectedIndividualBookingIndex = index}}
                            class="flex-1 text-left cursor-pointer"
                    >
                        <span class:underline={selectedIndividualBookingIndex === index}>
                            Guest #{index + 1} ({individualBooking.customerIndividualServiceBookingList.length})
                        </span>
                    </button>
                    <button
                            on:click={() => deleteGuest(index)}
                            class="ml-4 text-red-500 cursor-pointer"
                    >
                        Delete
                    </button>
                </li>
            {/each}

            <!--Create a new guest-->
            <li>
                <button
                        on:click={createNewGuest}
                        class="select-none w-full text-center cursor-pointer bg-green-500 text-white py-2 mt-4"
                >
                    + Add New Guest
                </button>
            </li>
        </ul>
    </div>

    <!--Service selection for guest column-->
    <div class="flex-1 flex flex-col">
        <ul class="flex-grow px-4 py-1 shadow w-full overflow-y-auto space-y-2">
            <GuestSelectService
                    bind:individualBooking={
                        customerBooking.customerIndividualBookingList[selectedIndividualBookingIndex]
                        }
            />
        </ul>
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
