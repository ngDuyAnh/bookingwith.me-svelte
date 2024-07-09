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

<div class="flex space-x-4 h-full">

    <!--Guest column-->
    <div class="flex flex-col h-full">
        <div class="w-[200px] h-full shadow overflow-y-auto">
            <!--Create a new guest-->
            <div class="flex justify-end">
                <button
                        on:click={createNewGuest}
                        class="new-guest select-none text-center cursor-pointer text-white px-2 py-2 flex flex-row justify-center items-center space-x-1"
                >
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-black text-sm">Add Guest</span>
                </button>
            </div>

            <ul class="flex-grow mt-4 space-y-2 px-2">
                {#each customerBooking.customerIndividualBookingList as individualBooking, index (index)}
                    <li id={index} class="flex justify-between items-center {selectedIndividualBookingIndex === index ? 'bg-blue-200 py-2':'bg-gray-100 py-1'} px-1 rounded-md shadow-sm ">
                        <button
                                on:click={() => {selectedIndividualBookingIndex = index}}
                                class="flex-1 text-left cursor-pointer"
                        >
                        <span>
                            Guest #{index + 1} (<span class="{individualBooking.customerIndividualServiceBookingList.length>0? '':'text-red-600'}">{individualBooking.customerIndividualServiceBookingList.length}</span>)
                        </span>
                        </button>
                        <button
                                on:click={() => deleteGuest(index)}
                                class="ml-4 text-red-500 cursor-pointer"
                        >
                            <svg class="w-6 h-6 text-red-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
                            </svg>

                        </button>
                    </li>
                {/each}
            </ul>

        </div>
    </div>

    <!--Service selection for guest column-->
    <div class="flex-1 flex flex-col">
        <ul class="flex-grow px-4 py-1 shadow w-full overflow-visible space-y-2">
            <GuestSelectService
                    bind:selectedIndividual={selectedIndividualBookingIndex}
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

<style>
    .new-guest{
        background: rgb(0,212,255);
        background: linear-gradient(0deg, #d9d9d9 0%, rgba(255, 255, 255, 0) 100%);
        border-bottom-left-radius: 5px;
        color: #333;
        border-top: #333333;
        border-right: #333333;
        border-width: 1px;
    }


    .new-guest:hover {
        background: rgb(0, 212, 255);
        background: linear-gradient(0deg, rgb(154, 255, 125) 0%, rgba(255, 255, 255, 0) 100%);
    }
</style>