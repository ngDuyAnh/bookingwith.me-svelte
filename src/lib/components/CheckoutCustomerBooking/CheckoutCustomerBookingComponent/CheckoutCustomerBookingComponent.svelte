<script>
    import {InfoCircleSolid, UserCircleSolid} from "flowbite-svelte-icons";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {customerBookingSubtotal, individualBookingCost} from "$lib/api/utility_functions/CustomerBooking.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {Card, Radio, Tooltip} from "flowbite-svelte";
    import {moveToCompleted} from "$lib/components/Modal/CustomerBookingClickModal/handle_customer_booking_state.js";
    import {
        checkoutCustomerBookingModal
    } from "$lib/components/Modal/CheckOutCustomerBookingModal/stores/CheckOutCustomerBookingModal.js";

    export let customerBooking;

    // Display subtotal is different because it is adjusted
    // Update the adjusted on changes to the display subtotal
    let subtotal =
        customerBookingSubtotal(customerBooking) +
        customerBooking.transaction.adjustment;
    $: if (
        subtotal !==
        customerBookingSubtotal(customerBooking) +
        customerBooking.transaction.adjustment
    ) {
        customerBooking.transaction.adjustment =
            subtotal - customerBookingSubtotal(customerBooking);
    }

    $: netSubtotal = (subtotal - customerBooking.transaction.discount).toFixed(2);

    $: tax = (netSubtotal * $business.businessInfo.taxRate).toFixed(2);
    $: subtotalWithTax = (parseFloat(netSubtotal) + parseFloat(tax)).toFixed(2);

    $: total = (
        parseFloat(subtotalWithTax) + customerBooking.transaction.tip
    ).toFixed(2);

    $: amountDue = (
        parseFloat(total) -
        customerBooking.transaction.creditCardPayment -
        customerBooking.transaction.cashPayment
    ).toFixed(2);
    $: amountPaid = total - amountDue;

    export let submitCallback;
    let successfulSubmit = false;

    let timeoutId = null;

    async function submitCheckout() {
        console.log("submitCheckout() customerBooking", customerBooking);

        // Amount due must be zero to be a valid transaction
        if (parseFloat(amountDue) === 0.0) {
            // Submit the transaction and move it to completed
            await moveToCompleted(customerBooking);
        } else {
            alert("Amount due is not zero.");
        }
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

    let guestPaymentMethods = [];

    // Initialzie with the individual booking list
    // Initialize the  customerBooking.transaction.creditCardPayment at the beginning with all the guest payment method is preferred card
    // On checking the ratio box, recalculate the card and cash payments

    function handlePaymentMethodChange(individualBooking, index, method) {

        const guestCost = individualBookingCost(individualBooking);

        console.log("!!!! individualBooking ",index," ",method, individualBooking);
        // Previously selected
        if (guestPaymentMethods[index] === 'card') {
            customerBooking.transaction.creditCardPayment -= guestCost;
        } else if (guestPaymentMethods[index] === 'cash') {
            customerBooking.transaction.cashPayment -= guestCost;
        }

        if (method === 'card') {
            customerBooking.transaction.creditCardPayment += guestCost;
        } else if (method === 'cash') {
            customerBooking.transaction.cashPayment += guestCost;
        }

        console.log("customer booking from change", customerBooking);
        guestPaymentMethods[index] = method;
    }

    $: console.log("customerBooking", customerBooking);

    let wasOpen=false;
    $:if ($checkoutCustomerBookingModal.open && !wasOpen) {
        wasOpen=true;
        guestPaymentMethods = Array(customerBooking.customerIndividualBookingList.length).fill('card');

        for(let i in customerBooking.customerIndividualBookingList)
        {
            console.log("i ",i," ",);
            const guestCost = individualBookingCost(customerBooking.customerIndividualBookingList[i]);
            customerBooking.transaction.creditCardPayment += guestCost;
            // handlePaymentMethodChange(, i, guestPaymentMethods[i]);
        }

        // console.log(guestPaymentMethods);
    }

    $: if(!$checkoutCustomerBookingModal.open)
    {
        wasOpen=false;
    }
</script>

<form
        class="flex flex-col space-y-4 h-full overflow-x-auto"
        id="checkoutForm"
        on:submit|preventDefault={submitCheckout}
>
    <div class="flex flex-col lg:flex-grow w-full h-full space-y-1">
        <div class="w-full flex justify-center w-full">
            <div class="flex flex-row items-center space-x-2 bg-gray-100 p-3 rounded-b-none rounded-lg shadow w-full">
                <UserCircleSolid class="h-6 w-6 text-blue-500"/>
                <span class="font-medium text-gray-700">{customerBooking.customer.customerName}</span>
                <span class="font-medium text-gray-700">{formatPhoneNumber(customerBooking.customer.phoneNumber)}</span>
            </div>
        </div>
        <div class="w-full flex flex-col lg:flex-row lg:flex-grow">
            <div class="flex w-full lg:flex-grow overflow-x-auto ">
                <Card class="lg:rounded-r-none rounded-t-none rounded-b-none lg:rounded-b lg:rounded-bl-xl w-fit lg:shadow-transparent lg:border-r-[1px]"
                      size="xl">
                    <h2 class="text-lg md:text-xl lg:text-2xl font-medium text-gray-800 dark:text-white mb-4 shadow-sm">
                        Booking Details
                    </h2>
                    <table class="table-fixed w-full border-y-[1px]">
                        <thead class="bg-gray-50">
                        <tr>
                            <th
                                    class="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    scope="col"
                            >
                                Guest
                            </th>
                            <th
                                    class="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Service
                            </th>
                            <th
                                    class="w-[100px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    scope="col"
                            >
                                Cost
                            </th>
                            <th
                                    class="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    scope="col"
                            >
                                Completed By
                            </th>
                            <th
                                    class="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    scope="col"
                            >
                                Pay With
                            </th>
                        </tr>
                        </thead>
                        <tbody class="bg-white">
                        {#each customerBooking.customerIndividualBookingList as individualBooking, index (individualBooking.individualID)}
                            {#each individualBooking.customerIndividualServiceBookingList as serviceBooking, ind (serviceBooking.serviceBookingID)}
                                <tr class={ind === 0 && index !== 0 ? "divide-y" : ""}>
                                    <td
                                            class="w-20 px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                    >
                                        <span hidden={ind > 0}>Guest #{index + 1}</span>
                                    </td>

                                    <!--Service name-->
                                    <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        <div class="flex justify-between items-center pt-2">
                                            <span class="w-[250px] truncate"
                                            >{serviceBooking.service.serviceName}</span
                                            >
                                            <Tooltip
                                            >{serviceBooking.service
                                                .serviceName}</Tooltip
                                            >
                                        </div>
                                    </td>

                                    <!--Cost-->
                                    <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        <div class="flex justify-between items-center pt-2">
                                            <span class="w-[100px] truncate">${serviceBooking.serviceCostAdjusted}</span>
                                            <!--<input type="number" bind:value={serviceBooking.serviceCostAdjusted} class="w-32 text-center border rounded p-1" />-->
                                        </div>
                                    </td>

                                    <!--Employee worked on the service-->
                                    <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        <div class="flex justify-between items-center pt-2">
                                            <span class="w-32 text-center truncate">{serviceBooking.assignedEmployee ? serviceBooking.assignedEmployee.employeeName : "Not Recorded"}</span>
                                            <Tooltip>{serviceBooking.assignedEmployee ? serviceBooking.assignedEmployee.employeeName : "Not Recorded"}</Tooltip>
                                        </div>
                                    </td>

                                    <!--Payment method-->
                                    <td
                                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {#if ind === 0}
                                            <div class="flex flex-col pt-2">
                                                <Radio
                                                        name="paymentMethod-{index}"
                                                        value="Card"
                                                        checked={guestPaymentMethods[index]==='card'}
                                                        on:change={() => handlePaymentMethodChange(individualBooking,index, 'card')}
                                                >
                                                    Card
                                                </Radio>
                                                <Radio
                                                        name="paymentMethod-{index}"
                                                        value="Cash"
                                                        checked={guestPaymentMethods[index]==='cash'}
                                                        on:change={() => handlePaymentMethodChange(individualBooking, index, 'cash')}
                                                >
                                                    Cash
                                                </Radio>
                                            </div>
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        {/each}
                        </tbody>
                    </table>
                </Card>
            </div>

            <!-- Cost Summary -->
            <div class="w-full flex justify-center lg:flex-grow lg:w-fit lg:mb-0 mb-1">
                <Card class="w-full lg:rounded-l-none rounded-t-none lg:rounded-br-xl lg:shadow-transparent lg:border-l-[1px]"
                      size="xl">
                    <h2 class="text-lg md:text-xl lg:text-2xl font-medium text-gray-800 dark:text-white mb-4 shadow-sm">
                        Cost Summary
                    </h2>
                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Subtotal:</span>
                        <div class="relative">
                            <span class="absolute left-1 top-1 z-[2]">$</span>
                            <input
                                    bind:value={subtotal}
                                    class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                                    step=".01"
                                    type="number"
                            />
                        </div>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Discount:</span>
                        <div class="relative">
                            <span class="absolute left-1 top-1 z-[2]">$</span>
                            <input
                                    bind:value={customerBooking.transaction.discount}
                                    class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                                    step=".01"
                                    type="number"
                            />
                        </div>
                    </div>
                    <div class="flex justify-between mb-2 border-b-2">
                        <div class="flex flex-row">
                            <span class="text-sm font-medium text-gray-700">Net Subtotal</span>
                            <InfoCircleSolid
                                    class="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1"
                                    id="netSubTotal"
                                    size="lg"
                            />
                            <Tooltip class="z-10" triggerdBy="#netSubTotal">Net Subtotal = Subtotal - Discount</Tooltip>
                            :
                        </div>
                        <span class="text-sm font-medium text-gray-900">${netSubtotal}</span
                        >
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Tax:</span>
                        <span class="text-sm font-medium text-gray-900">${tax}</span>
                    </div>

                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Tip:</span>
                        <div class="relative">
                            <span class="absolute left-1 top-1 z-[2]">$</span>
                            <input
                                    bind:value={customerBooking.transaction.tip}
                                    class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                                    step=".01"
                                    type="number"
                            />
                        </div>
                    </div>

                    <div class="flex justify-between mb-2 border-b-2">
                        <span class="text-sm font-medium text-gray-700">Total:</span>
                        <span class="text-sm font-medium text-gray-900">${total}</span>
                    </div>

                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Credit Card Payment:</span>
                        <div class="relative">
                            <span class="absolute left-1 top-1 z-[2]">$</span>
                            <input
                                    bind:value={customerBooking.transaction.creditCardPayment}
                                    class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                                    step=".01"
                                    type="number"
                            />
                        </div>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Cash Payment:</span>
                        <div class="relative">
                            <span class="absolute left-1 top-1 z-[2]">$</span>
                            <input
                                    bind:value={customerBooking.transaction.cashPayment}
                                    class="pl-5 pr-1 py-1 w-24 text-sm font-medium text-gray-900 border rounded"
                                    step=".01"
                                    type="number"
                            />
                        </div>
                    </div>

                    <div class="flex justify-between bg-green-100 px-[3px] border-y-[2px] items-center mb-2"
                         class:!bg-red-100={parseFloat(amountDue) !== 0}>
                        <span class="text-sm font-medium text-gray-700">Amount Paid:</span>
                        <span class="text-lg font-medium text-green-500"
                              class:!text-red-500={parseFloat(amountDue) !== 0}>${parseFloat(amountPaid).toFixed(2)}</span>
                    </div>

                    <div class="flex justify-between px-[3px] border-y-[2px] items-center mb-2"
                         class:!bg-red-100={parseFloat(amountDue) !== 0}>
                        <span class="text-sm font-medium text-gray-700">Due:</span>
                        <span class="text-lg font-medium text-green-500"
                              class:!text-red-500={parseFloat(amountDue) !== 0}>${parseFloat(amountDue).toFixed(2)}</span>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</form>

<style>
</style>
