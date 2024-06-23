<script>
    import {onMount, setContext} from "svelte";
    import {getLobbyBookingList} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {initializeCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {formatToDate} from "$lib/application/Formatter.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import Appointment
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Appointment/Appointment.svelte";
    import Lobby from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Lobby/Lobby.svelte";
    import Servicing
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Servicing/Servicing.svelte";
    import Completed
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/Completed/Completed.svelte";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        bookingStateList,
        findCustomerBookingById
    } from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {
        customerBookingClickModal
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import {Button, Search, Spinner} from "flowbite-svelte";
    import CustomerBookingClickModal from "$lib/components/CustomerBookingClickModal/CustomerBookingClickModal.svelte";
    import {SearchOutline} from 'flowbite-svelte-icons';

    let filteredBookingStateList = [];
    let searchValue = '';

    async function fetchCustomerBookingList() {
        loading = true;

        // Get the customer booking list
        const response = await getLobbyBookingList($business.businessInfo.businessID, $now.format(formatToDate));
        bookingStateList.set(response.bookingList);
        filteredBookingStateList = $bookingStateList;

        // Find and reinitialize the customer booking for the modal
        if ($customerBookingClickModal.customerBooking) {
            const findID = $customerBookingClickModal.customerBooking.id;
            const foundCustomerBooking = findCustomerBookingById(findID);
            if (foundCustomerBooking) {
                customerBookingClickModal.update(current => {
                    return {
                        ...current,
                        customerBooking: foundCustomerBooking
                    };
                });
            } else {
                console.log('Customer booking not found for customer booking click modal.');
            }
        }
        loading = false;

        console.log("bookingStateList", $bookingStateList);
        console.log("filteredBookingStateList", filteredBookingStateList);
    }

    let showSearchText = "";

    function normalize(text) {
        return text.replace(/[\W_]+/g, "").toLowerCase();
    }

    function searchBookings() {
        console.log("searchValue", searchValue);

        const normalizedSearchValue = normalize(searchValue);

        // Assume $bookingStateList is structured like: [ [], [], [], [] ]
        // where each sub-array represents bookings in different states: 0->appointment, 1->lobby, 2->servicing, 3->completed
        if (searchValue.length == 0) {
            filteredBookingStateList = $bookingStateList;
            showSearchText = "";
        } else {
            filteredBookingStateList = $bookingStateList.map(state => {
                return state.filter(booking =>
                    normalize(booking.customer.customerName).includes(normalizedSearchValue) ||
                    normalize(booking.id.toString()).includes(normalizedSearchValue) ||
                    normalize(booking.customer.phoneNumber.toString()).includes(normalizedSearchValue)
                );
            });
            showSearchText = `Showing Results For: ${searchValue}`;
        }


        console.log("filteredBookingStateList", filteredBookingStateList);
    }


    setContext('fetchCustomerBookingList', fetchCustomerBookingList);

    let loading = true;
    onMount(async () => {
        await fetchCustomerBookingList();

        loading = false;

    });

    // Automatic fetch for the latest customer booking list
    //setInterval(async () => fetchCustomerBookingList(), 10000);

    async function submitCustomerBooking(customerBooking) {
        // Submit the change to the server
        await initializeCustomerBooking(customerBooking);

        // Update the customer booking list
        await fetchCustomerBookingList();
    }

    setContext('submitCustomerBooking', submitCustomerBooking);

    $: if (searchValue.length >= 0) {
        searchBookings();
    }

</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner/>
    </div>
{:else}

    <div class="flex sm:flex-row flex-col sm:items-center items-start justify-start sm:space-x-4 pt-4 px-4 2xl:items-center 2xl:justify-center">
        <form class="flex max-w-xs items-center" on:submit={searchBookings}>
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
                - Lobby: <strong>{filteredBookingStateList[1].length}</strong> - Service: <strong>{filteredBookingStateList[2].length}</strong> - Completed: <strong>{filteredBookingStateList[3].length}</strong> </div>
        </div>

    </div>
    <div class="flex flex-row w-screen h-full justify-between 2xl:items-center 2xl:justify-center space-x-4 overflow-x-auto p-4">
        <Appointment
                bind:bookingStateList={filteredBookingStateList}
        />
        <Lobby
                bind:bookingStateList={filteredBookingStateList}
        />
        <Servicing
                bind:bookingStateList={filteredBookingStateList}
        />
        <Completed
                bind:bookingStateList={filteredBookingStateList}
        />
    </div>
{/if}

<!-- Modal for customer booking click -->
<CustomerBookingClickModal/>
