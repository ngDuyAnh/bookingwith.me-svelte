<script>
    import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        handleNewCustomerBookingLobbyComponent,
        resetCustomerBookingLobbyComponent
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";

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


    $:console.log("customerBooking", customerBooking);
</script>

<table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
    <tr>
        <th scope="col" class="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Guest
        </th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Service
        </th>
    </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
    {#each customerBooking.customerIndividualBookingList as customerIndividualBookingList, index (customerIndividualBookingList.individualID)}
        <tr>
            <td class="w-20 px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Guest #{index + 1}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex flex-col space-y-2">
                    {#each customerIndividualBookingList.customerIndividualServiceBookingList as individualServiceBooking, ind (individualServiceBooking.serviceBookingID)}
                        <span class="max-w-[150px] text-wrap">{individualServiceBooking.service.serviceName}</span>
                    {/each}
                </div>
            </td>
        </tr>
    {/each}
    </tbody>
</table>
