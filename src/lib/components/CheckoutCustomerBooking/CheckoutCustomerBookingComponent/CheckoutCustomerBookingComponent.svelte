<script>
    import {CustomerBooking, CustomerIndividualBooking} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {
        handleNewCustomerBookingLobbyComponent,
        resetCustomerBookingLobbyComponent
    } from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/store/customerBookingLobbyComponent.js";
    import {UserCircleSolid, UserSolid} from "flowbite-svelte-icons";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {Tooltip} from "flowbite-svelte";
    import {customerBookingSubtotal} from "$lib/api/utility_functions/CustomerBooking.js";
    import {business} from "$lib/page/stores/business/business.js";

    export let customerBooking;

    $: subtotal = customerBookingSubtotal(customerBooking);
    let discount = 0;
    $: netSubtotal = subtotal - discount;

    $: tax = netSubtotal * $business.businessInfo.taxRate;
    $: grossTotal = netSubtotal + tax;

    console.log("$business.businessInfo.taxRate", $business.businessInfo.taxRate)

    let tip = 0;

    $: total = subtotal - discount + tax + tip;

    let creditCardPayment = 0;
    let cashPayment = 0;
    $: amountDue = total - creditCardPayment - cashPayment;


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
    <span class="font-medium text-gray-700">{customerBooking.customer.customerName}</span> <span
        class="font-medium text-gray-700">{formatPhoneNumber(customerBooking.customer.phoneNumber) }</span>
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
                                <span class="w-32 text-center truncate">{individualServiceBooking.servicingDuration ? individualServiceBooking.servicingDuration : 0}
                                    mins</span>
                                <Tooltip>{individualServiceBooking.servicingDuration ? individualServiceBooking.servicingDuration : 0}
                                    mins
                                </Tooltip>
                                <span class="w-32 text-center truncate">${individualServiceBooking.serviceCostAdjusted ? individualServiceBooking.serviceCostAdjusted : 0}</span>
                                <Tooltip>
                                    ${individualServiceBooking.serviceCostAdjusted ? individualServiceBooking.serviceCostAdjusted : 0}</Tooltip>
                                <span class="w-32 text-center truncate">${individualServiceBooking.discount ? individualServiceBooking.discount : 0}
                                    %</span>
                                <Tooltip>${individualServiceBooking.discount ? individualServiceBooking.discount : 0}%
                                </Tooltip>
                                <span class="w-32 text-center truncate">{individualServiceBooking.assignedEmployee ? individualServiceBooking.assignedEmployee.employeeName : 'Not Recorded'}</span>
                                <Tooltip>{individualServiceBooking.assignedEmployee ? individualServiceBooking.assignedEmployee.employeeName : 'Not Assigned'}</Tooltip>
                            </div>
                        {/each}
                    </div>
                </td>
            </tr>
        {/each}

        <!--Total row-->
        <tr class="bg-gray-100">
            <td colspan="2" class="text-right px-6 py-4 text-sm font-medium text-gray-900">Total:</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customerBooking.totalCost}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customerBooking.totalDiscount}%</td>
            <td colspan="2" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
        </tr>
    </tbody>

    <!--Cost summary-->
    <div>
        <h2 class="text-lg font-medium text-gray-700 mb-4">Cost Summary</h2>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Subtotal:</span>
            <span class="text-sm font-medium text-gray-900">${subtotal}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Discount:</span>
            <span class="text-sm font-medium text-gray-900">${discount}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Net Subtotal:</span>
            <span class="text-sm font-medium text-gray-900">${netSubtotal}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Tax:</span>
            <span class="text-sm font-medium text-gray-900">${tax}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Gross total:</span>
            <span class="text-sm font-medium text-gray-900">${grossTotal}</span>
        </div>

        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Tip:</span>
            <span class="text-sm font-medium text-gray-900">${tip}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Total:</span>
            <span class="text-sm font-medium text-gray-900">${total}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Credit Card Payment:</span>
            <span class="text-sm font-medium text-gray-900">${creditCardPayment}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Cash Payment:</span>
            <span class="text-sm font-medium text-gray-900">${cashPayment}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-700">Amount Due:</span>
            <span class="text-sm font-medium text-gray-900">${amountDue}</span>
        </div>
    </div>

</table>

