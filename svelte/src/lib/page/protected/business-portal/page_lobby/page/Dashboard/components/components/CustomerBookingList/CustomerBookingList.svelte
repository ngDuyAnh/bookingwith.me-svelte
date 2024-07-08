<script>
    import CustomerBookingListItem
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingList/CustomerBookingListItem/CustomerBookingListItem.svelte";
    import {
        handleCustomerBookingClick
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {dndzone} from 'svelte-dnd-action';
    import {flip} from 'svelte/animate';
    import {
        moveToAppointment,
        moveToCompleted,
        moveToLobby,
        moveToServicing
    } from "$lib/components/CustomerBookingClickModal/handle_customer_booking_state.js";

    const flipDurationMs = 200;

    export let customerBookingList;
    export let columnID;


    function handleSort(id, e) {
        if (e.detail.info.trigger == "droppedIntoZone") {

            const custBooking = e.detail.items.find(booking => booking.id === e.detail.info.id);
            console.log("the customer booking", custBooking);

            if (custBooking) {
                if (id === 0) {
                    moveToAppointment(custBooking);

                } else if (id === 1) {
                    moveToLobby(custBooking);

                } else if (id === 2) {
                    moveToServicing(custBooking);

                } else if (id === 3) {
                    moveToCompleted(custBooking);

                }
            } else {
                console.log("Can't find booking");
            }

        }
        customerBookingList = e.detail.items;
    }


</script>

<ul class="flex-grow px-4 py-1 shadow w-full overflow-y-auto space-y-2"
    use:dndzone={{items:customerBookingList, flipDurationMs, type:'columns'}}
    on:consider={(e) => handleSort(columnID, e)} on:finalize={(e) => handleSort(columnID, e)}>

    {#each customerBookingList as customerBooking (customerBooking.id)}
        <div
                animate:flip={{duration:flipDurationMs}}>
            <li class="border-b last:border-b-0">
                <button
                        class="p-4 {customerBooking.bookingState == 3? 'bg-gray-400':'bg-white'} rounded shadow select-none w-full text-left
                        hover:bg-gray-300 transition-all duration-300 ease-in-out"
                        on:click={() => handleCustomerBookingClick(customerBooking)}
                >
                    <CustomerBookingListItem {customerBooking}/>
                </button>
            </li>
        </div>
    {/each}
</ul>