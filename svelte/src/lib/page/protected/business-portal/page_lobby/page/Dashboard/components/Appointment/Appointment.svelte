<script>
    import CustomerBookingList
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingList.svelte";
    import {bookingStateList} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {Modal} from "flowbite-svelte";
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {getContext} from "svelte";
    import { Tooltip, Button } from 'flowbite-svelte';
    import {
        moveToCompleted,
        moveToLobby,
        moveToServicing
    } from "$lib/api/api_server/lobby-portal/utility-functions/handle_customer_booking_state.js";
    import {
        customerBooking,
        customerIndividualList,
        pageIndex
    } from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";
    import ServiceBookingEditor
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/ServiceBookingEditor/ServiceBookingEditor.svelte";

    let openModal = false;
    let selectedCustomerBooking = {};
    let hasMsg;

    function handleCustomerBookingClick(customerBooking) {
        openModal = true;
        selectedCustomerBooking = {...customerBooking};
        hasMsg = selectedCustomerBooking.message === "";
    }

    function handleAddNewBookingClick()
    {
        console.log("handleAddNewBookingClick")
    }

    // Retrieve customer booking list update function
    const submitCustomerBooking = getContext('submitCustomerBooking');

    async function handleLobbyClick() {
        openModal = false;
        console.log('Moving to lobby:', selectedCustomerBooking);

        await moveToLobby($now, selectedCustomerBooking, submitCustomerBooking);
    }

    async function handleServicingClick() {
        openModal = false;
        console.log('Start servicing:', selectedCustomerBooking);

        await moveToServicing($now, selectedCustomerBooking, submitCustomerBooking);
    }

    async function handleCompleteClick() {
        openModal = false;
        console.log('Moving to completed:', selectedCustomerBooking);

        await moveToCompleted($now, selectedCustomerBooking, submitCustomerBooking);
    }

    let edit = false;

    function editBooking() {
        console.log("edit clicked");
        edit = true;

        if (selectedCustomerBooking && selectedCustomerBooking.customerIndividualBookingList) {
            customerIndividualList.set(
                selectedCustomerBooking.customerIndividualBookingList.map(individualBooking =>
                    individualBooking.customerIndividualServiceBookingList.map(serviceBooking => ({
                        service: serviceBooking.service,
                        employee: serviceBooking.employee
                    }))
                )
            );
        }

        customerBooking.set(selectedCustomerBooking);
        console.log("customerBooking",$customerBooking);
        pageIndex.set(0);
    }
</script>

<div class="min-w-[348.4px] max-w-[348.4px] bg-gray-100 rounded shadow p-4 overflow-y-auto border border-sky-200">
    <!-- List Header -->
    <div class="px-4 py-2 flex items-center justify-between select-none">
        <h2 class="text-lg font-bold">{"Appointment"}</h2>

        <div class="flex items-center space-x-4">
            <span class="text-sm">{$bookingStateList[0].length}</span>

            <button on:click={handleAddNewBookingClick} class="text-blue-500 hover:text-blue-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </button>
        </div>
    </div>

    <CustomerBookingList
            customerBookingList={$bookingStateList[0]}
            handleCustomerBookingClick={handleCustomerBookingClick}
    />
</div>

<!-- Modal for customer booking -->
<div class="">
    <Modal bind:open={openModal} size="md" outsideclose>
        <div>
            <p><strong>Customer name:</strong> {selectedCustomerBooking.customer.customerName}</p>
            <p><strong>Phone number:</strong> {selectedCustomerBooking.customer.phoneNumber}</p>
            <p><strong>Booking
                time:</strong> {dayjs(selectedCustomerBooking.bookingTime, formatToTime).format(formatToTimeAM)}</p>
            <p class="break-words"><strong>Message:</strong> {selectedCustomerBooking.message}
                {#if !hasMsg}
                    <span class="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-sky-400 opacity-75"></span>
                {/if}
            </p>
            <div class="mt-4">
                <div class="font-bold">Guest(s):</div>
                {#each selectedCustomerBooking.customerIndividualBookingList as individualBooking}
                    <div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
                        {#each individualBooking.customerIndividualServiceBookingList as serviceBooking}
                            <div class="mt-1 p-1">
                                <p>{serviceBooking.service.serviceName}
                                    ({serviceBooking.employee?.employeeName || 'Any'})</p>
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>

        <div class="mt-4 flex ">
            <div class="justify-start">
                <Button id="show-tooltip" on:click={editBooking} color="light" outline>
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                    </svg>
                </Button>
                <Tooltip triggeredBy="#show-tooltip">Edit Booking</Tooltip>
            </div>
            <div class="ml-auto justify-end items-center space-x-2">
                <span class="text-gray-700 font-bold">Move to:</span>
                <button class="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        on:click={handleLobbyClick}>Lobby
                </button>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        on:click={handleServicingClick}>Servicing
                </button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        on:click={handleCompleteClick}>Complete
                </button>
            </div>
        </div>
    </Modal>
</div>


<ServiceBookingEditor
    bind:edit={edit}
/>