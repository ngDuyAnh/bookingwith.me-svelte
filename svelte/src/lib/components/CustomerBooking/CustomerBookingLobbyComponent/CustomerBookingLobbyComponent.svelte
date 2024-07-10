<script>
    import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import GuestSelectService
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/GuestSelectService/GuestSelectService.svelte";
    import {Avatar, Button} from "flowbite-svelte";
    import GuestList from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/GuestList/GuestList.svelte";
    import TimeList from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/TimeList/TimeList.svelte";
    import {isToday, today} from "$lib/page/stores/now/now_dayjs_store.js";
    import {ChevronLeftOutline, ChevronRightOutline} from "flowbite-svelte-icons";
    import dayjs from "dayjs";
    import {formatToDate} from "$lib/application/Formatter.js";

    export let customerBooking = {
        ...CustomerBooking(),
        customerIndividualBookingList: [CustomerIndividualBooking()]
    };

    export let bookingChannel;
    $: if (customerBooking.bookingChannel === -1) {
        customerBooking.bookingChannel = bookingChannel;
    }

    let selectedIndividualBookingIndex = 0;

    // Function to handle the creation of a new individual booking
    function createNewGuest() {
        customerBooking.customerIndividualBookingList = [
            ...customerBooking.customerIndividualBookingList,
            CustomerIndividualBooking()
        ]
        selectedIndividualBookingIndex = customerBooking.customerIndividualBookingList.length - 1;
    }

    function selectToday() {
        customerBooking.bookingDate = today();
    }

    function selectTomorrow() {
        customerBooking.bookingDate = dayjs(customerBooking.bookingDate).add(1, 'day').format(formatToDate);
    }

    function selectYesterday() {
        customerBooking.bookingDate = dayjs(customerBooking.bookingDate).subtract(1, 'day').format(formatToDate);
    }

    $: console.log("customerBooking", customerBooking);
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

                <GuestList
                        bind:customerBooking={customerBooking}
                        bind:selectedIndividualBookingIndex={selectedIndividualBookingIndex}
                />

            </div>
        </div>

    <!--Service selection for guest column-->
    <div class="flex-1 flex flex-col">
        <div class="flex flex-col h-full">
            <div class="relative flex flex-row flex-grow items-center justify-center mb-2">
                <div class="absolute border-2 border-gray-200 h-1 w-full rounded-lg"></div>
                <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                    <Avatar size="xs" class="flex justify-center items-center">2</Avatar>
                    <span class="font-bold">Service(s)</span>
                </div>
            </div>

            <div class="h-full shadow overflow-y-auto">
                <GuestSelectService
                        bind:customerBooking={customerBooking}
                        individualBookingIndex={selectedIndividualBookingIndex}
                />
            </div>
        </div>
    </div>

    <!--Booking time-->
    <div class="flex-1 flex flex-col">
        <div class="flex flex-col h-full">
            <div class="relative flex flex-row flex-grow items-center justify-center mb-2">
                <div class="absolute border-2 border-gray-200 h-1 w-full rounded-lg"></div>
                <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                    <Avatar size="xs" class="flex justify-center items-center">3</Avatar>
                    <span class="font-bold">Date & Time</span>
                </div>
            </div>

            <!--Date select-->
            <div class="flex flex-row sm:justify-normal justify-center items-center pb-2">
                <Button class="h-fit text-md mr-1" size="xs" color="light" on:click={()=>{selectToday()}} disabled={isToday(customerBooking.bookingDate)}>Today</Button>
                <div class="flex items-center">
                    <Button class="rounded-r-none h-fit" size="xs" color="light" on:click={()=>{selectYesterday()}}>
                        <ChevronLeftOutline class="w-6 h-6"/>
                    </Button>
                    <input class="border-gray-300 w-[8rem]" bind:value={customerBooking.bookingDate} type="date"/>
                    <Button class="rounded-l-none h-fit" size="xs" color="light" on:click={()=>{selectTomorrow()}}>
                        <ChevronRightOutline class="w-6 h-6"/>
                    </Button>
                </div>
            </div>

            <!--Time select-->
            <div class="h-full shadow overflow-y-auto">
                <TimeList
                        bind:customerBooking={customerBooking}
                />
            </div>
        </div>
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