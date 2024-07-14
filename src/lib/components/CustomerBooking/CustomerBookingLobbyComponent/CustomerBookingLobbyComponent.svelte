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
    import {formatPhoneNumber, rawPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {getCustomer} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import SubmitBooking
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/SubmitBooking/SubmitBooking.svelte";

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



    async function submit() {
        console.log("submit()", customerBooking);
    }

    $: console.log("customerBooking", customerBooking);

    let totalServiceCost = 0;
    let totalGuests = 0;

    $:if (customerBooking) {
        totalServiceCost = 0;
        totalGuests = 0;

        customerBooking.customerIndividualBookingList.forEach(individualBooking => {
            totalGuests += 1;
            individualBooking.customerIndividualServiceBookingList.forEach(booking => {
                totalServiceCost += booking.service.serviceCost;
            });
        })
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
        <div class="w-[230px] h-full shadow overflow-y-auto">
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
                    <span class="font-bold">Service</span>
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

            <!--Date & Time select-->
            <div class="h-full shadow overflow-y-auto flex flex-col items-center w-full">
                <div class="flex flex-row sm:justify-normal justify-center items-center pb-2">
                    <Button class="h-fit text-md mr-1" size="xs" color="light" on:click={()=>{selectToday()}}
                            disabled={isToday(customerBooking.bookingDate)}>Today
                    </Button>
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

                <TimeList
                        bind:customerBooking={customerBooking}
                />
            </div>
        </div>
    </div>

    <!--Customer profile-->
    <div class="flex-1 flex flex-col">
        <div class="flex flex-col h-full">
            <div class="relative flex flex-row flex-grow items-center justify-center mb-2">
                <div class="absolute border-2 border-gray-200 h-1 w-full rounded-lg"></div>
                <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                    <Avatar size="xs" class="flex justify-center items-center">4</Avatar>
                    <span class="font-bold">Customer</span>
                </div>
            </div>

            <!--Get customer phone number-->
            <div class="h-full shadow overflow-y-auto flex flex-col p-1.5 w-full">
                <SubmitBooking
                    bind:customerBooking={customerBooking}
                />
            </div>
        </div>
    </div>
</div>

<style>
    .new-guest {
        background: linear-gradient(0deg, #f0f0f0 0%, rgba(255, 255, 255, 0) 100%); /* Light gray to transparent */
        color: #333; /* Dark gray for text */
        border: 1px solid #ccc; /* Light gray border */
        border-bottom-left-radius: 10px; /* Rounded corner for bottom-left */
        transition: background-color 0.3s, border-color 0.3s; /* Smooth transitions for interaction */
    }

    .new-guest:hover {
        background: linear-gradient(0deg, #e0e0e0 0%, rgba(255, 255, 255, 0) 100%); /* Slightly darker gray on hover */
        border-color: #b3b3b3; /* Slightly darker border on hover */
    }

    .new-guest:active {
        background: linear-gradient(0deg, #cccccc 0%, rgba(255, 255, 255, 0) 100%); /* Even darker gray for active state */
        border-color: #999; /* Darker border for active state */
    }


</style>