<script>
    import {customerBookingEstimate} from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
    import {
        moveToLobby
    } from "$lib/components/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {Button, Modal} from "flowbite-svelte";
    import {ExclamationCircleOutline} from "flowbite-svelte-icons";
    import LiveIndicator
        from "$lib/page/customer-booking-portal/get/page/components/LiveIndicator/LiveIndicator.svelte";
    import {customerBooking} from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
    import {business} from "$lib/page/stores/business/business.js";

    let openArrivalModal = false;

    async function notifyArrival() {
        moveToLobby($customerBooking);

        // Force react
        customerBookingEstimate.set($customerBookingEstimate);

        // Send an alert to let the customer know that they have been moved to lobby
        alert(
            "Thank you for letting us know you have arrived. Please wait in the lobby until you are called."
        );
    }
</script>

<div class="p-2 h-full w-full flex flex-col items-center justify-center">
    <!-- Appointment information box -->
    <div class="bg-white max-w-4xl border-2 rounded-lg">
        <!-- Appointment header -->
        <div class="p-4 text-xl font-bold text-blue-900">
            <div class="flex flex-col items-center sm:flex-row sm:items-center justify-center sm:justify-between w-full">
                <span class="block sm:inline mb-2 sm:mb-0">Your appointment is <span
                        class="underline">today</span>!</span>
                <LiveIndicator/>
            </div>
        </div>

        <!-- Appointment information -->
        <div class="p-4 text-red-800 text-sm">
            <span>Please arrive early to ensure smooth service.</span>
        </div>

        <div class="p-4 flex justify-between text-green-800 space-x-4">
            <div class="flex flex-col">
                <span>Queue position</span>
                <span class="animate-pulse text-sm font-semibold">{$customerBookingEstimate.queuePosition}</span>
            </div>
            <div class="flex flex-col items-end">
                <span>Servicing time</span>
                <div>
                    <span class="animate-pulse text-sm font-semibold">{$customerBookingEstimate.estimateServicingStartTime}</span>
                    <span class="text-sm">to</span>
                    <span class="animate-pulse text-sm font-semibold">{$customerBookingEstimate.estimateServicingEndTime}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Action options -->
    <div class="mt-4 flex flex-wrap justify-center">
        <Button
                class="mr-2 animate-pulse bg-blue-500 text-white font-semibold rounded shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                on:click={() => {
                    openArrivalModal = true;
                }}
        >
            Check in
        </Button>

        <a
                class="mr-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                href={$business.businessInfo.googleMapsDirectionLink}
                target="_blank"
                type="button"
        >
            <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    fill="currentColor"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
            >
                <path
                        clip-rule="evenodd"
                        d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
                        fill-rule="evenodd"
                />
            </svg>
        </a>

        <a
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                href="tel:{$business.businessInfo.businessPhoneNumber}"
                target="_blank"
                type="button"
        >
            <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-800 dark:text-white"
                    fill="currentColor"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z"/>
            </svg>
        </a>
    </div>
</div>

<!-- Modal to confirm the customer arrival in the lobby -->
<Modal autoclose bind:open={openArrivalModal} outsideclose size="xs">
    <div class="text-center">
        <ExclamationCircleOutline
                class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
        />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you in the lobby now?
        </h3>

        <Button class="me-2" color="red" on:click={notifyArrival}>
            Yes, I am here!
        </Button>

        <Button color="alternative">Cancel</Button>
    </div>
</Modal>
