<script>
    import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import GuestSelectService
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/GuestSelectService/GuestSelectService.svelte";
    import {Alert, Avatar, Button, Toast} from "flowbite-svelte";
    import GuestList from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/GuestList/GuestList.svelte";
    import TimeList from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/TimeList/TimeList.svelte";
    import {isToday, today} from "$lib/page/stores/business/business.js";
    import {
        ArrowLeftOutline,
        ArrowRightOutline,
        ChevronLeftOutline,
        ChevronRightOutline, ExclamationCircleSolid,
        InfoCircleSolid
    } from "flowbite-svelte-icons";
    import dayjs from "dayjs";
    import {formatToDate} from "$lib/application/Formatter.js";
    import SubmitBooking
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/SubmitBooking/SubmitBooking.svelte";
    import {
        customerBookingLobbyComponent,
        handleNewCustomerBookingLobbyComponent,
        pleaseFetchAvailability,
        resetCustomerBookingLobbyComponent
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";
    import {tick} from "svelte";
    import {fly} from "svelte/transition";

    export let options = {
        showSendSms: true,
        showLobbyBookingState: true,

        sendSmsFlag: true,
        lobbyBookingStateFlag: false
    };

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
        $customerBookingLobbyComponent.bookingDate = today();
    }

    function selectTomorrow() {
        $customerBookingLobbyComponent.bookingDate = dayjs($customerBookingLobbyComponent.bookingDate).add(1, 'day').format(formatToDate);
    }

    function selectYesterday() {
        $customerBookingLobbyComponent.bookingDate = dayjs($customerBookingLobbyComponent.bookingDate).subtract(1, 'day').format(formatToDate);
    }


    export let submitCallback;
    let successfulSubmit = false;

    let timeoutId = null;

    function submitSuccessful() {

        successfulSubmit = true;

        // Hide the modal header and footer
        if (submitCallback) {
            submitCallback(successfulSubmit);
        }

        console.log("submitSuccessful()", customerBooking)

        // If it is not edit customer booking
        // Reset back to create new customer booking
        handleNewCustomerBookingLobbyComponent();
        if (customerBooking.id === -1) {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }

            // Call second function after 2 seconds
            timeoutId = setTimeout(resetBooking, 1000);
        }
    }

    // Second function to be called after a delay to get back to the create page
    function resetBooking() {

        successfulSubmit = false;

        // Show the modal header and footer
        if (submitCallback) {
            submitCallback(successfulSubmit);
        }

        selectedIndividualBookingIndex = 0;
        customerBooking = {
            ...CustomerBooking(),
            customerIndividualBookingList: [CustomerIndividualBooking()]
        };

        // Reset the store
        resetCustomerBookingLobbyComponent();
    }

    const hoverDiv = "border-2 border-transparent hover:border-gray-300 transition-colors duration-300 rounded"

    export let focusIndividualColumnIndex;
    export let focusDualColumnIndex;

    function prevDualCol() {
        if (focusDualColumnIndex !== 1)
            focusDualColumnIndex--;
        focusIndividualColumnIndex = 1;
    }

    function prevIndividualCol() {
        if (focusIndividualColumnIndex !== 1)
            focusIndividualColumnIndex--;
        focusDualColumnIndex = 1;
    }

    async function nextDualCol() {
        if (focusDualColumnIndex !== 2)
            focusDualColumnIndex++;
        focusIndividualColumnIndex = 1;
        if (focusDualColumnIndex === 2) {
            await tick(); // Ensure all updates are processed
            pleaseFetchAvailability();
        }
    }

    async function nextIndividualCol() {
        if (focusIndividualColumnIndex !== 4)
            focusIndividualColumnIndex++;
        focusDualColumnIndex = 1;

        if (focusIndividualColumnIndex === 3) {
            await tick(); // Ensure all updates are processed
            pleaseFetchAvailability();
        }
    }
    let selectedSomething;

    function nextCol() {
        if (focusIndividualColumnIndex !== 4)
            focusIndividualColumnIndex++;
    }

    let alertMsg = ""
    let hideMsg=false;

    $:if(selectedSomething)
    {
        hideMsg=true;
        selectedSomething=false;
    }

    $:if(alertMsg!=="")
    {
        hideMsg=false;
    }


</script>

{#if !successfulSubmit}
    <div class="relative flex flex-col h-full">
        <div class=" relative flex items-center justify-center pb-2 w-full xl:hidden z-10">
            <!-- Container for the Previous Button -->
            <div class=" absolute left-0 flex-1 z-10">
                <Button class="disable-double-tap-zoom !p-2 hidden md:{focusDualColumnIndex===1?'hidden':'block'}"
                        on:click={prevDualCol}>
                    <ArrowLeftOutline class="w-4 h-4"/>
                </Button>
                <Button class="disable-double-tap-zoom md:hidden !p-2 {focusIndividualColumnIndex===1?'hidden':'block'}"
                        on:click={prevIndividualCol}>
                    <ArrowLeftOutline class="w-4 h-4"/>
                </Button>
            </div>

            <div class="flex flex-row justify-between w-full md:flex hidden">
                <div class="relative flex flex-row flex-grow items-center justify-center mb-2 xl:flex md:flex hidden w-1/2">
                    <div class="absolute border-2 border-gray-200 h-1 w-11/12 rounded-lg"></div>
                    <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                        <Avatar size="xs"
                                class="flex justify-center items-center">{focusDualColumnIndex == 1 ? 1 : 3}</Avatar>
                        <span class="font-bold">
                        {#if focusDualColumnIndex === 1}
                            Guest
                        {:else if focusDualColumnIndex == 2}
                            Date & Time
                        {/if}
                    </span>
                    </div>
                </div>
                <div class="relative flex flex-row flex-grow items-center justify-center mb-2 xl:flex md:flex hidden w-1/2">
                    <div class="absolute border-2 border-gray-200 h-1 w-11/12 rounded-lg"></div>
                    <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                        <Avatar size="xs"
                                class="flex justify-center items-center">{focusDualColumnIndex == 1 ? 2 : 4}</Avatar>
                        <span class="font-bold">
                        {#if focusIndividualColumnIndex === 1}
                            Service
                        {:else if focusIndividualColumnIndex == 2}
                            Customer
                        {/if}
                    </span>
                    </div>
                </div>
            </div>

            <div class="absolute border-2 border-gray-200 h-1 w-[75%] rounded-lg md:hidden"></div>

            <div class="relative flex flex-row flex-grow items-center justify-center mb-2 md:hidden">
                <!--                <div class="absolute border-2 border-gray-200 h-1 w-full rounded-lg"></div>-->
                <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                    <Avatar size="xs" class="flex justify-center items-center">{focusIndividualColumnIndex}</Avatar>
                    <span class="font-bold">
                        {#if focusIndividualColumnIndex === 1}
                            Guest
                        {:else if focusIndividualColumnIndex == 2}
                            Service
                        {:else if focusIndividualColumnIndex == 3}
                            Date & Time
                        {:else if focusIndividualColumnIndex == 4}
                            Customer
                        {/if}
                    </span>
                </div>
            </div>

            <!-- Container for the Next Button -->
            <div class="absolute flex-1 text-right z-10 right-0">
                <Button class="disable-double-tap-zoom !p-2 hidden md:{focusDualColumnIndex===2?'hidden':'block'}"
                        on:click={nextDualCol}>
                    <ArrowRightOutline class="w-4 h-4"/>
                </Button>
                <Button class="disable-double-tap-zoom md:hidden !p-2 {focusIndividualColumnIndex===4?'hidden':'block'}"
                        on:click={nextIndividualCol}>
                    <ArrowRightOutline class="w-4 h-4"/>
                </Button>
            </div>
        </div>
        <div class="relative flex flex-grow xl:max-h-full max-h-[95%] flex-row xl:space-x-4">

            <!--Guest column-->
            <div class="flex-1 flex flex-col xl:min-w-[230px] md:min-w-[50%] min-w-[100%] xl:block md:{focusDualColumnIndex===1?'block':'hidden'} {focusIndividualColumnIndex===1?'block':'hidden'}">
                <div class="flex flex-col h-full">
                    <div class="relative flex flex-row flex-grow items-center justify-center mb-2 xl:flex hidden">
                        <div class="absolute border-2 border-gray-200 h-1 w-full rounded-lg"></div>
                        <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                            <Avatar size="xs" class="flex justify-center items-center">1</Avatar>
                            <span class="font-bold">Guest</span>
                        </div>
                    </div>
                    <div class="h-full shadow overflow-y-auto {hoverDiv}">
                        <!--Create a new guest-->
                        <div class="flex justify-end">
                            <button
                                    on:click={createNewGuest}
                                    class="new-guest select-none text-center cursor-pointer text-white px-2 py-2 flex flex-row justify-center items-center space-x-1"
                            >
                                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                     fill="currentColor"
                                     viewBox="0 0 24 24">
                                    <path fill-rule="evenodd"
                                          d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                                          clip-rule="evenodd"/>
                                </svg>
                                <span class="text-black text-sm">Add Guest</span>
                            </button>
                        </div>

                        <GuestList
                                {nextCol}
                                bind:customerBooking={customerBooking}
                                bind:selectedIndividualBookingIndex={selectedIndividualBookingIndex}
                        />

                    </div>
                </div>
            </div>

            <!--Service selection for guest column-->
            <div class="flex-1 flex flex-col xl:min-w-[230px] md:min-w-[50%] min-w-[100%] xl:block md:{focusDualColumnIndex===1?'block':'hidden'} {focusIndividualColumnIndex===2?'block':'hidden'}">
                <div class="flex flex-col h-full">
                    <div class="relative flex flex-row flex-grow items-center justify-center mb-2 xl:flex hidden">
                        <div class="absolute border-2 border-gray-200 h-1 w-full rounded-lg"></div>
                        <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                            <Avatar size="xs" class="flex justify-center items-center">2</Avatar>
                            <span class="font-bold">Service</span>
                        </div>
                    </div>

                    <div class="h-full shadow overflow-y-auto {hoverDiv}" on:hover={()=>{hideMsg=true;}}>
                        <GuestSelectService
                                bind:selectedSomething={selectedSomething}
                                bind:customerBooking={customerBooking}
                                individualBookingIndex={selectedIndividualBookingIndex}
                        />
                    </div>
                </div>
            </div>

            <!--Booking time-->
            <div class="flex-1 max-h-full flex flex-col xl:min-w-[310px] md:min-w-[230px] min-w-[100%] xl:block md:{focusDualColumnIndex===2?'block':'hidden'}  {focusIndividualColumnIndex===3?'block':'hidden'}">
                <div class="flex flex-col h-full overflow-auto">
                    <div class="relative flex flex-row flex-grow items-center justify-center mb-2 xl:flex hidden">
                        <div class="absolute border-2 border-gray-200 h-1 w-full rounded-lg"></div>
                        <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                            <Avatar size="xs" class="flex justify-center items-center">3</Avatar>
                            <span class="font-bold">Date & Time</span>
                        </div>
                    </div>

                    <!--Date & Time select-->
                    <div class="h-full shadow overflow-y-auto flex flex-col items-center w-full stripeBG {hoverDiv} overflow-x-hidden">
                        <div class="flex flex-row sm:justify-normal justify-center items-center p-1 bg-white w-full">
                            <Button class="h-fit text-md mr-1" size="xs" color="light"
                                    on:click={()=>{selectToday()}}
                                    disabled={isToday($customerBookingLobbyComponent.bookingDate)}>Today
                            </Button>
                            <div class="flex items-center">
                                <Button class="rounded-r-none h-fit" size="xs" color="light"
                                        on:click={()=>{selectYesterday()}}>
                                    <ChevronLeftOutline class="w-6 h-6"/>
                                </Button>
                                <input class="border-gray-300 w-[8rem]"
                                       bind:value={$customerBookingLobbyComponent.bookingDate}
                                       type="date"/>
                                <Button class="rounded-l-none h-fit" size="xs" color="light"
                                        on:click={()=>{selectTomorrow()}}>
                                    <ChevronRightOutline class="w-6 h-6"/>
                                </Button>
                            </div>
                        </div>

                        <TimeList
                                bind:customerBooking={customerBooking}
                                bind:alertMsg={alertMsg}
                        />
                    </div>
                </div>
            </div>

            <!--Customer profile-->
            <div class="flex-1 flex flex-col xl:min-w-[230px] md:min-w-[230px] min-w-[100%] xl:block md:{focusDualColumnIndex===2?'block':'hidden'} {focusIndividualColumnIndex===4?'block':'hidden'}">
                <div class="flex flex-col h-full">
                    <div class="relative flex flex-row flex-grow items-center justify-center mb-2 xl:flex hidden">
                        <div class="absolute border-2 border-gray-200 h-1 w-full rounded-lg"></div>
                        <div class="flex flex-row bg-white z-10 space-x-1 px-1">
                            <Avatar size="xs" class="flex justify-center items-center">4</Avatar>
                            <span class="font-bold">Customer</span>
                        </div>
                    </div>

                    <div class="h-full shadow overflow-y-auto {hoverDiv}">
                        <SubmitBooking
                                bind:customerBooking={customerBooking}
                                submitSuccessful={submitSuccessful}
                                options={options}
                        />
                    </div>
                </div>
            </div>


        </div>
        <div class="{alertMsg==='' || hideMsg ? 'hidden' : ''} fixed top-0 right-0 xl:hidden  w-full flex justify-center items-center">
            <Alert
                    class="rounded-t-none border-x-2 border-b-2 !p-2 sm:!p-4 flex justify-center"
                    dismissable={false}
                    params={{ x: 200 }}
                    transition={fly}
            >
                <ExclamationCircleSolid class="ripple w-5 h-5 ripple" slot="icon"/>
                {alertMsg}
            </Alert>
        </div>
    </div>
{:else}
    <div class="flex flex-col items-center justify-center h-full">
        <svg class="animate-pop-open text-gray-800 dark:text-white" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="rgba(80,180,80,1)" viewBox="0 0 24 24">
            <path fill-rule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                  clip-rule="evenodd"/>
        </svg>
        <h1>
            New Booking Successful!
        </h1>
    </div>
{/if}

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


    .stripeBG {
        background-image: linear-gradient(45deg, #ffffff 25%, #fffceb 25%, #fffceb 50%, #ffffff 50%, #ffffff 75%, #fffceb 75%, #fffceb 100%);
        background-size: 36.77px 36.77px;
    }

    .flex-item {
        flex: 0 1 auto; /* flex-grow: 0, flex-shrink: 1, flex-basis: auto */
    }


    :global(.ripple) {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px red solid;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
        }
    }

    @-webkit-keyframes pulse {
        0% {
            -webkit-box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
        }
        70% {
            -webkit-box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
        }
        100% {
            -webkit-box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
        }
    }
</style>
