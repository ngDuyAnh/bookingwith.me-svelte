<script>
    import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import GuestSelectService
        from "$lib/components/CustomerBooking/CreateCustomerBookingLobbyComponent/GuestSelectService/GuestSelectService.svelte";
    import {Avatar, Tooltip} from "flowbite-svelte";

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

<div class="flex space-x-4 h-full">

    <!--Guest column-->
    <div class="flex flex-col h-full">
        <div class="relative flex flex-row flex-grow items-center justify-center mb-2">
            <div class="absolute border-2 border-gray-200 h-1 w-full rounded-lg"></div>
            <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                <Avatar size="xs" class="flex justify-center items-center">1</Avatar>
                <span class="font-bold">Guest</span>
            </div>
        </div>
        <div class="w-[200px] h-full shadow overflow-y-auto">
            <!--Create a new guest-->
            <div class="flex justify-end">
                <button
                        on:click={createNewGuest}
                        class="new-guest select-none text-center cursor-pointer text-white px-2 py-2 flex flex-row justify-center items-center space-x-1"
                >
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" fill="currentColor"
                         viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                              d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                              clip-rule="evenodd"/>
                    </svg>
                    <span class="text-black text-sm">Add Guest</span>
                </button>
            </div>

            <ul class="flex-grow mt-4 space-y-2 px-2">
                {#each customerBooking.customerIndividualBookingList as individualBooking, index (index)}
                    <li id={index}
                        class="flex justify-between items-center {selectedIndividualBookingIndex === index ? 'bg-blue-50 py-2 border-[1px] border-blue-700':'bg-gray-100 py-1'} px-1 rounded-md shadow-sm ">
                        <button
                                on:click={() => {selectedIndividualBookingIndex = index}}
                                class="flex-1 text-left cursor-pointer"
                        >
                        <span class="text-gray-950">
                            Guest #{index + 1} (<span
                                class="{individualBooking.customerIndividualServiceBookingList.length>0? '':'text-red-600'}">{individualBooking.customerIndividualServiceBookingList.length}</span>)
                        </span>
                        </button>
                        <button
                                on:click={() => deleteGuest(index)}
                                class="ml-4 text-red-500 cursor-pointer"
                        >
                            <svg class="w-4 h-4 text-red-800 dark:text-white" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                        </button>
                        <Tooltip type="light">Delete Guest</Tooltip>

                    </li>
                {/each}
            </ul>

        </div>
    </div>

    <!--Service selection for guest column-->
    <div class="flex-1 flex flex-col">
        <div class="relative flex flex-row flex-grow items-center justify-center mb-2">
            <div class="absolute border-2 border-gray-200 h-1 w-full rounded-xl"></div>
            <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                <Avatar size="xs" class="flex justify-center items-center">2</Avatar>
                <span class="font-bold">Service</span>
            </div>
        </div>
        <ul class="h-full px-4 py-1 shadow w-full overflow-visible space-y-2">
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
    .new-guest {
        background: rgb(0, 212, 255);
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