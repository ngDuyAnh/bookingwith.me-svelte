<script>
    import CustomerBookingListItem
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingListItem/CustomerBookingListItem.svelte";
    import {
        handleCustomerBookingClick
    } from "$lib/components/Modal/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {dndzone} from 'svelte-dnd-action';
    import {flip} from 'svelte/animate';
    import {
        moveToAppointment,
        moveToCompleted,
        moveToLobby,
        moveToServicing
    } from "$lib/components/Modal/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {
        disableManagerAccess,
        managerAccess
    } from "$lib/components/Modal/GetManagerPasswordModal/stores/managerAccess.js";
    import {
        getManagerPasswordModal,
        handleOpenGetManagerPasswordModal
    } from "$lib/components/Modal/GetManagerPasswordModal/stores/getManagerPasswordModal.js";
    import {
        fetchCustomerBookingQueueList,dragStartedStore
    } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";

    export let flipDurationMs;
    export let customerBookingList;
    export let columnID;
    export let dragDisabled;
    export let moveFinished;
    export let droppedIntoID;

    function handleManagerAccess() {
        // Request manager access
        if (!$managerAccess) {
            handleOpenGetManagerPasswordModal();
        }
        // Disable manager access
        else {
            disableManagerAccess();
        }
    }

    let getManagerAccess = false;
    let bookingToMoveToAppointment=null;

    function handleSort(id, e) {
        let noColumnChange=false;
        if (e.detail.info.trigger === "dragStarted") {
            dragStartedStore.set(id)
        } else
        if (e.detail.info.trigger === "droppedIntoZone") {


            dragDisabled = true;
            droppedIntoID = columnID;

            const custBooking = e.detail.items.find(booking => booking.id === e.detail.info.id);

            if (id === $dragStartedStore) {
                moveFinished = true;
                noColumnChange=true;

            } else if (custBooking)
            {
                if (id === 0) {
                    getManagerAccess = true;
                    handleManagerAccess();
                    bookingToMoveToAppointment = custBooking;
                } else if (id === 1) {
                    (async () => {
                        await moveToLobby(custBooking).then(() => {
                            moveFinished = true;
                        });
                    })();
                } else if (id === 2) {
                    (async () => {
                        await moveToServicing(custBooking).then(() => {
                            moveFinished = true;
                        });
                    })();
                } else if (id === 3) {
                    (async () => {
                        await moveToCompleted(custBooking).then(() => {
                            moveFinished = true;
                        });
                    })();
                }
            } else {
                console.log("Can't find booking");
            }

            dragStartedStore.set(null);
        }

        customerBookingList = e.detail.items;

        if(noColumnChange)
        {
            (async () => {
                await fetchCustomerBookingQueueList();
            })();
        }

    }

    // manager access given so move to appointment
    $:if(getManagerAccess && $managerAccess)
    {
        (async () => {
            await moveToAppointment(bookingToMoveToAppointment).then(() => {
                moveFinished = true;
                getManagerAccess=false;
                disableManagerAccess();
                bookingToMoveToAppointment=null;
            });
        })();
    }

    let wasOpen = false;

    // modal was open
    $:if ($getManagerPasswordModal.open)
    {
        wasOpen=true;
    }

    // modal was open but manager access was not given
    $:if (getManagerAccess && wasOpen && !$getManagerPasswordModal.open)
    {
        moveFinished = true;
        wasOpen=false;
        getManagerAccess=false;
        disableManagerAccess();
        bookingToMoveToAppointment=null;

        (async () => {
            await fetchCustomerBookingQueueList();
        })();
    }

</script>
<div class="relative flex-grow">
    <ul class="h-full px-4 py-1 shadow w-full overflow-y-auto space-y-2"
        use:dndzone={{items:customerBookingList, flipDurationMs, type:'columns', dragDisabled}}
        on:consider={(e) => handleSort(columnID, e)} on:finalize={(e) => handleSort(columnID, e)}>

        {#each customerBookingList as customerBooking (customerBooking.id)}
            <div
                    animate:flip={{duration:flipDurationMs}}
            >
                <div class="border-b last:border-b-0">
                    <button
                            class="p-4 {customerBooking.bookingState === 3? 'bg-gray-400':'bg-white'} rounded shadow select-none w-full text-left
                        hover:bg-gray-300 transition-all duration-300 ease-in-out"
                            on:click={() => handleCustomerBookingClick(customerBooking)}
                    >
                        <CustomerBookingListItem {customerBooking}/>
                    </button>
                </div>
            </div>
        {/each}
    </ul>
</div>
