<script>
    import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        handleNewCustomerBookingLobbyComponent,
        resetCustomerBookingLobbyComponent
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";
    import {UserCircleSolid, UserSolid} from "flowbite-svelte-icons";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {Tooltip} from "flowbite-svelte";

    // export let options = {
    //     showSendSms: true,
    //     showLobbyBookingState: true,
    //
    //     sendSmsFlag: true,
    //     lobbyBookingStateFlag: false
    // };

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
<div class="flex flex-row items-center space-x-2 bg-gray-100 p-3 rounded-lg shadow mb-2">
    <UserCircleSolid class="h-6 w-6 text-blue-500"/>
    <span class="font-medium text-gray-700">{customerBooking.customer.customerName}</span> <span class="font-medium text-gray-700">{formatPhoneNumber(customerBooking.customer.phoneNumber) }</span>
</div>

<table class="table-fixed w-full">
    <thead class="bg-gray-50">
    <tr>
        <th scope="col" class="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Guest
        </th>
        <th class="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Service
        </th>
        <th scope="col" class="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Duration
        </th>
        <th scope="col" class="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cost
        </th>
        <th scope="col" class="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Discount
        </th>
        <th scope="col" class="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Completed By
        </th>
    </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
    {#each customerBooking.customerIndividualBookingList as customerIndividualBookingList, index (customerIndividualBookingList.individualID)}
        <tr>
            <td class="w-20 px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Guest #{index + 1}
            </td>
            <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="space-y-2 divide-y divide-gray-300">
                    {#each customerIndividualBookingList.customerIndividualServiceBookingList as individualServiceBooking, ind (individualServiceBooking.serviceBookingID)}
                        <div class="flex justify-between items-center pt-2">
                            <span class="w-32 truncate">{individualServiceBooking.service.serviceName}</span>
                            <Tooltip>{individualServiceBooking.service.serviceName}</Tooltip>
                            <span class="w-32 text-center truncate">{individualServiceBooking.servicingDuration ? individualServiceBooking.servicingDuration : 0} mins</span>
                            <Tooltip>{individualServiceBooking.servicingDuration ? individualServiceBooking.servicingDuration : 0} mins</Tooltip>
                            <span class="w-32 text-center truncate">${individualServiceBooking.serviceCostAdjusted ? individualServiceBooking.serviceCostAdjusted : 0}</span>
                            <Tooltip>${individualServiceBooking.serviceCostAdjusted ? individualServiceBooking.serviceCostAdjusted : 0}</Tooltip>
                            <span class="w-32 text-center truncate">${individualServiceBooking.discount ? individualServiceBooking.discount : 0}%</span>
                            <Tooltip>${individualServiceBooking.discount ? individualServiceBooking.discount : 0}%</Tooltip>
                            <span class="w-32 text-center truncate">{individualServiceBooking.assignedEmployee ? individualServiceBooking.assignedEmployee.employeeName : 'Not Recorded'}</span>
                            <Tooltip>{individualServiceBooking.assignedEmployee ? individualServiceBooking.assignedEmployee.employeeName : 'Not Assigned'}</Tooltip>
                        </div>
                    {/each}
                </div>
            </td>
        </tr>
    {/each}
    <tr class="bg-gray-100">
        <td colspan="2" class="text-right px-6 py-4 text-sm font-medium text-gray-900">Total:</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customerBooking.totalCost}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customerBooking.totalDiscount}%</td>
        <td colspan="2" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
    </tr>
    </tbody>
</table>

