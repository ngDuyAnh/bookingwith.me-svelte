<script>
    import {CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";

    export let customerBooking;
    export let selectedIndividualBookingIndex;

    // Function to handle the creation of a new individual booking
    function createNewGuest() {
        customerBooking.customerIndividualBookingList.push(CustomerIndividualBooking());
        selectedIndividualBookingIndex = customerBooking.customerIndividualBookingList.length - 1;
    }

    // Function to handle the deletion of an individual booking
    function deleteGuest(index) {
        // Always keep at least one guest
        if (customerBooking.customerIndividualBookingList.length > 1) {
            if (customerBooking.customerIndividualBookingList[index].customerIndividualServiceBookingList.length === 0 ||
                confirm('Are you sure you want to delete this guest?')) {
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

<ul class="flex-grow px-4 py-1 shadow w-full overflow-y-auto space-y-2">
    {#each customerBooking.customerIndividualBookingList as individualBooking, index (index)}
        <li id={index} class="flex justify-between items-center p-2 bg-gray-100 rounded-md shadow-sm">
            {#key individualBooking.customerIndividualServiceBookingList.length}
                <button
                        on:click={() => {selectedIndividualBookingIndex = index}}
                        class="flex-1 text-left cursor-pointer"
                >
                        <span
                                class:underline={selectedIndividualBookingIndex === index}
                                class:text-red-500={individualBooking.customerIndividualServiceBookingList.length === 0}
                        >
                            Guest #{index + 1} ({individualBooking.customerIndividualServiceBookingList.length})
                        </span>
                </button>
                <button
                        on:click={() => deleteGuest(index)}
                        class="ml-4 text-red-500 cursor-pointer"
                >
                    Delete
                </button>
            {/key}
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
