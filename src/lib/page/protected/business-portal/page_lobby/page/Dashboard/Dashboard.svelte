<script>
    import {onMount} from "svelte";
    import Appointment
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Appointment/Appointment.svelte";
    import Lobby from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Lobby/Lobby.svelte";
    import Servicing
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/Servicing.svelte";
    import Completed
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Completed/Completed.svelte";
    import {customerBookingQueueList} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {Button, Search, Spinner} from "flowbite-svelte";
    import CustomerBookingClickModal
        from "$lib/components/Modal/CustomerBookingClickModal/CustomerBookingClickModal.svelte";
    import {SearchOutline} from 'flowbite-svelte-icons';
    import {handleOpenCustomerProfileModal} from "$lib/components/Modal/CustomerProfileModal/customerProfileModal.js";
    import {normalizeSearchInput} from "$lib/application/NormalizeSearchInput.js";
    import {shortCustomerBookingID} from "$lib/api/utilitiy_functions/CustomerBooking.js";

    let columns = [
        {
            id: 0,
            name: "Appointment"
        },
        {
            id: 1,
            name: "Lobby"
        },
        {
            id: 2,
            name: "Servicing"
        },
        {
            id: 3,
            name: "Completed"
        }
    ];


    let searchValue = '';
    let showSearchText = "";
    let filteredBookingStateList = $customerBookingQueueList;

    function handleSearchFilter() {
        const normalizedSearchValue = normalizeSearchInput(searchValue);

        // Assume $customerBookingQueueList is structured like: [ [], [], [], [] ]
        // where each sub-array represents bookings in different states: 0->appointment, 1->lobby, 2->servicing, 3->completed
        if (searchValue.length === 0) {
            filteredBookingStateList = $customerBookingQueueList;
            showSearchText = "";
        } else {
            filteredBookingStateList = $customerBookingQueueList.map(state => {
                return state.filter(booking =>
                    normalizeSearchInput(booking.customer.customerName).includes(normalizedSearchValue) ||
                    normalizeSearchInput(shortCustomerBookingID(booking.id)).includes(normalizedSearchValue) ||
                    normalizeSearchInput(booking.customer.phoneNumber.toString()).includes(normalizedSearchValue)
                );
            });
            showSearchText = `Showing Results For: ${searchValue}`;
        }
    }

    function handleSearchClick() {
        const normalizedSearchValue = normalizeSearchInput(searchValue);

        // Customer profile
        const phonePattern1 = /^\d{10}$/;
        if (phonePattern1.test(normalizedSearchValue)) {
            console.log("Opening customer profile...")
            handleOpenCustomerProfileModal(normalizedSearchValue);

            // Reset the search field
            searchValue = "";
        }
        // Filter search
        else {
            handleSearchFilter();
        }
    }

    let loading = true;
    onMount(async () => {
        loading = false;
    });


    $: if (searchValue.length >= 0 || $customerBookingQueueList) {
        handleSearchFilter();
    }

    // $: console.log("filteredBookingStateList", filteredBookingStateList);

    let droppedIntoID;
    let dragDisabled = false;
    let moveFinished = false;
    const flipDurationMs = 200;

    let progressFinished = false;

    $:if (dragDisabled === true) {
        startProgress();
    }

    $:if (moveFinished && progressFinished) {
        dragDisabled = false;
        moveFinished = false;
        progressFinished = false;
    }

    function startProgress() {
        const startTime = Date.now(); // Record the start time
        const duration = flipDurationMs; // Duration of 700ms

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime; // Calculate elapsed time

            if (elapsed >= duration) { // If 700ms or more has passed
                clearInterval(interval); // Stop the interval
                progressFinished = true;
            }
        }, 10); // Update every 10ms for a smoother progress bar
    }

</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner/>
    </div>
{:else}


    <div class="flex sm:flex-row flex-col sm:items-center items-start justify-start sm:space-x-4 pt-4 px-4 2xl:items-center 2xl:justify-center">
        <form class="flex max-w-xs items-center" on:submit={handleSearchClick}>
            <Search bind:value={searchValue} size="md" class="rounded-none rounded-l-lg py-2.5"
                    placeholder="Search Booking Info" maxlength="20">
            </Search>
            <Button type="submit" class="!p-2.5 rounded-s-none">
                <SearchOutline class="w-5 h-5"/>
            </Button>
        </form>

        <div class="!flex !flex-col">
            <strong class="sm:my-0 mt-1 text-sm">{showSearchText}</strong>
            <div class="sm:my-0 mt-1 text-xs">Appointment: <strong>{filteredBookingStateList[0].length}</strong>
                - Lobby: <strong>{filteredBookingStateList[1].length}</strong> - Service:
                <strong>{filteredBookingStateList[2].length}</strong> - Completed:
                <strong>{filteredBookingStateList[3].length}</strong></div>
        </div>
    </div>

    <div class="relative flex flex-row w-screen h-full justify-between 2xl:items-center 2xl:justify-center space-x-4 overflow-x-auto p-4">

        {#each columns as column, index (column.id)}
            <div
                    class="flex flex-col min-w-[348.4px] h-full bg-gray-100 rounded shadow overflow-y-auto border border-sky-200"
            >
                {#if index === 0}
                    <Appointment
                            flipDurationMs={flipDurationMs}
                            bind:moveFinished={moveFinished}
                            bind:dragDisabled={dragDisabled}
                            bind:droppedIntoID={droppedIntoID}
                            bind:customerBookingQueueList={filteredBookingStateList}
                    />
                {:else if index === 1}
                    <Lobby
                            flipDurationMs={flipDurationMs}
                            bind:moveFinished={moveFinished}
                            bind:dragDisabled={dragDisabled}
                            bind:droppedIntoID={droppedIntoID}
                            bind:customerBookingQueueList={filteredBookingStateList}
                    />
                {:else if index === 2}
                    <Servicing
                            flipDurationMs={flipDurationMs}
                            bind:moveFinished={moveFinished}
                            bind:dragDisabled={dragDisabled}
                            bind:droppedIntoID={droppedIntoID}
                            bind:customerBookingQueueList={filteredBookingStateList}
                    />
                {:else if index === 3}
                    <Completed
                            flipDurationMs={flipDurationMs}
                            bind:moveFinished={moveFinished}
                            bind:dragDisabled={dragDisabled}
                            bind:droppedIntoID={droppedIntoID}
                            bind:customerBookingQueueList={filteredBookingStateList}
                    />
                {/if}
            </div>
        {/each}
    </div>
{/if}

<!-- Modal for customer booking click -->
<CustomerBookingClickModal/>
