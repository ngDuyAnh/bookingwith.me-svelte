<script>
    import {UserCircleSolid} from "flowbite-svelte-icons";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {customerBookingSubtotal} from "$lib/api/utility_functions/CustomerBooking.js";
    import {business} from "$lib/page/stores/business/business.js";

    export let customerBooking;

    // Display subtotal is different because it is adjusted
    // Update the adjusted on changes to the display subtotal
    let subtotal = customerBookingSubtotal(customerBooking) + customerBooking.transaction.adjustment;
    $: if (subtotal !== customerBookingSubtotal(customerBooking) + customerBooking.transaction.adjustment)
    {
        customerBooking.transaction.adjustment = subtotal - customerBookingSubtotal(customerBooking);
    }

    $: netSubtotal = (subtotal - customerBooking.transaction.discount).toFixed(2);

    $: tax = (netSubtotal * $business.businessInfo.taxRate).toFixed(2);
    $: subtotalWithTax = (parseFloat(netSubtotal) + parseFloat(tax)).toFixed(2);

    $: total = (parseFloat(subtotalWithTax) + customerBooking.transaction.tip).toFixed(2);

    $: amountDue = (parseFloat(total) - customerBooking.transaction.creditCardPayment - customerBooking.transaction.cashPayment).toFixed(2);


    export let submitCallback;
    let successfulSubmit = false;

    let timeoutId = null;

    function submitCheckout() {
        //
        // successfulSubmit = true;
        //
        // // Hide the modal header and footer
        // if (submitCallback) {
        //     submitCallback(successfulSubmit);
        // }
        //
        // console.log("submitSuccessful()", customerBooking)
        //
        // // If it is not edit customer booking
        // // Reset back to create new customer booking
        // handleNewCustomerBookingLobbyComponent();
        // if (customerBooking.id === -1) {
        //     if (timeoutId !== null) {
        //         clearTimeout(timeoutId);
        //     }
        //
        //     // Call second function after 2 seconds
        //     timeoutId = setTimeout(resetBooking, 1000);
        // }



        console.log("Submit checkout here")
    }

    // Second function to be called after a delay to get back to the create page
    // function resetBooking() {
    //
    //     successfulSubmit = false;
    //
    //     // Show the modal header and footer
    //     if (submitCallback) {
    //         submitCallback(successfulSubmit);
    //     }
    //
    //     selectedIndividualBookingIndex = 0;
    //     customerBooking = {
    //         ...CustomerBooking(),
    //         customerIndividualBookingList: [CustomerIndividualBooking()]
    //     };
    //
    //     // Reset the store
    //     resetCustomerBookingLobbyComponent();
    // }
    //
    // const hoverDiv = "border-2 border-transparent hover:border-gray-300 transition-colors duration-300 rounded"


    $:console.log("customerBooking", customerBooking);
</script>

<form id="checkoutForm" on:submit|preventDefault={submitCheckout} class="space-y-4 h-full">
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
                Cost
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
                <td colspan="3" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="space-y-2 divide-y divide-gray-300">
                        {#each customerIndividualBookingList.customerIndividualServiceBookingList as individualServiceBooking (individualServiceBooking.serviceBookingID)}
                            <div class="flex justify-between items-center pt-2">
                                <!--Service name-->
                                <span class="w-32 truncate">{individualServiceBooking.service.serviceName}</span>
                                <Tooltip>{individualServiceBooking.service.serviceName}</Tooltip>

                                <!--Cost-->
                                <span class="w-32 truncate">${individualServiceBooking.serviceCostAdjusted}</span>
                                <!--<input type="number" bind:value={individualServiceBooking.serviceCostAdjusted} class="w-32 text-center border rounded p-1" />-->

                                <!--Employee worked on the service-->
                                <span class="w-32 text-center truncate">{individualServiceBooking.assignedEmployee ? individualServiceBooking.assignedEmployee.employeeName : 'Not Recorded'}</span>
                                <Tooltip>{individualServiceBooking.assignedEmployee ? individualServiceBooking.assignedEmployee.employeeName : 'Not Recorded'}</Tooltip>
                            </div>
                        {/each}
                    </div>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>

    <!-- Cost Summary -->
    <div>
        <h2 class="text-lg font-medium text-gray-700 mb-4">Cost Summary</h2>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Subtotal:</span>
            <span class="text-sm font-medium text-gray-900">${subtotal}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Adjustment:</span>
            <div class="relative">
                <span class="absolute left-1 top-1 z-20">$</span>
                <input
                        type="number"
                        bind:value={subtotal}
                        class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                />
            </div>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Discount:</span>
            <div class="relative">
                <span class="absolute left-1 top-1 z-20">$</span>
                <input
                        type="number"
                        bind:value={customerBooking.transaction.discount}
                        class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                />
            </div>
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
            <span class="text-sm font-medium text-gray-700">Subtotal with Tax:</span>
            <span class="text-sm font-medium text-gray-900">${subtotalWithTax}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Tip:</span>
            <div class="relative">
                <span class="absolute left-1 top-1 z-20">$</span>
                <input
                        type="number"
                        bind:value={customerBooking.transaction.tip}
                        class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                />
            </div>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Total:</span>
            <span class="text-sm font-medium text-gray-900">${total}</span>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Credit Card Payment:</span>
            <div class="relative">
                <span class="absolute left-1 top-1 z-20">$</span>
                <input
                        type="number"
                        bind:value={customerBooking.transaction.creditCardPayment}
                        class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                />
            </div>
        </div>
        <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Cash Payment:</span>
            <div class="relative">
                <span class="absolute left-1 top-1 z-20">$</span>
                <input
                        type="number"
                        bind:value={customerBooking.transaction.cashPayment}
                        class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                />
            </div>
        </div>
        <div class="flex justify-between">
            <span class="text-sm font-medium text-gray-700">Amount Due:</span>
            <span class="text-sm font-medium text-green-500" class:!text-red-500={parseFloat(amountDue) !== 0}>${parseFloat(amountDue).toFixed(2)}</span>
        </div>
    </div>
</form>
