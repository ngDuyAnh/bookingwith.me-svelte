<script>
    import {
        Alert,
        Button,
        Card,
        Dropdown,
        Input,
        Label,
        Radio,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";
    import {now, today} from "$lib/page/stores/business/business.js";
    import {formatToDate, formatToYearMonth} from "$lib/application/Formatter.js";
    import dayjs from "dayjs";
    import {fly} from "svelte/transition";
    import {ChevronDownOutline, InfoCircleSolid} from "flowbite-svelte-icons";
    import {CustomerBookingChannel, CustomerBookingCost} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {getCustomerBookingList} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import dinero from "dinero.js";

    let startDateSelected = $now.startOf('month').format(formatToDate);
    let endDateSelected = today();

    let selectedMonth = $now.format(formatToYearMonth);

    let showAlert = false;
    let showInformation = false;
    let alertMsg = "";

    let selectedOption = "monthly";
    let summaryDate = "";

    $: if (selectedOption) {
        showInformation = false;
    }


    function totalBookingInformation() {
        return {
            "lobbyBookings": 0,
            "onlineBookings": 0,
            "reviewSMS": 0,
            "confirmationSMS": 0,
            "reminderSMS": 0,
        }
    }

    function totalSummary() {
        return [
            {
                category: "Lobby Bookings",
                number: 0,
                costPerItem: dinero({amount: CustomerBookingCost.LOBBY, currency: 'CAD'}),
                totalCost: 0
            },
            {
                category: "Online Bookings",
                number: 0,
                costPerItem: dinero({amount: CustomerBookingCost.ONLINE, currency: 'CAD'}),
                totalCost: 0
            },
            {
                category: "SMS",
                number: 0,
                costPerItem: dinero({amount: CustomerBookingCost.SMS, currency: 'CAD'}),
                totalCost: 0
            },
            {category: "Total", number: 0, costPerItem: null, totalCost: 0}
        ];
    }

    let bookingListInfo = {};
    let summary = [];


    async function submitDate() {
        summaryDate = "";
        bookingListInfo = {}
        summary = []
        showAlert = false;
        showInformation = false;
        alertMsg = ""

        let valid = false;
        switch (selectedOption) {
            case "custom": {
                let startDate = dayjs(startDateSelected);
                let endDate = dayjs(endDateSelected);

                if (startDate.isAfter(endDate)) {
                    alertMsg = "Start date cannot be after the end date. Please pick a valid date range.";
                    showAlert = true;
                    console.log("Start date cannot be after the end date");
                } else {

                    summaryDate = `${startDate.format('DD MMM, YYYY')} to ${endDate.format('DD MMM, YYYY')}`

                    valid = true;
                }
                break;
            }
            case "monthly": {

                console.log("selectedMonth", selectedMonth);
                let month = dayjs(selectedMonth);
                let startDate = month.startOf('month');
                let endDate = month.add(month.daysInMonth() - 1, "day");

                startDateSelected = startDate.startOf('month').format(formatToDate);
                endDateSelected = endDate.format(formatToDate);

                summaryDate = `${month.format('MMM, YYYY')}`
                valid = true;
                break;
            }
        }

        if (valid) {
            await getBookingInformation();
        }
    }


    async function getBookingInformation() {
        const response = await getCustomerBookingList($business.businessInfo.businessID, startDateSelected, endDateSelected);

        bookingListInfo = totalBookingInformation();
        for (let res in response) {

            switch (response[res]["bookingChannel"]) {
                case CustomerBookingChannel.LOBBY: {
                    bookingListInfo["lobbyBookings"] += 1;
                    break;
                }
                case CustomerBookingChannel.ONLINE: {
                    bookingListInfo["onlineBookings"] += 1;
                    break;
                }
            }

            if (response[res]["smsAppointmentReminderSid"]) {
                console.log("res is", response[res]);
                bookingListInfo["reminderSMS"] += 1;
            }

            if (response[res]["smsConfirmationSent"]) {
                console.log("res is", response[res]);
                bookingListInfo["confirmationSMS"] += 1;
            }

            if (response[res]["smsReviewReminderSent"]) {
                console.log("res is", response[res]);
                bookingListInfo["reviewSMS"] += 1;
            }

        }
        summary = totalSummary();

        summary[0].number = bookingListInfo["lobbyBookings"];
        summary[0].totalCost = summary[0].costPerItem.multiply(summary[0].number);
        summary[1].number = bookingListInfo["onlineBookings"];
        summary[1].totalCost = summary[1].costPerItem.multiply(summary[1].number);
        summary[2].number = bookingListInfo["reminderSMS"] + bookingListInfo["confirmationSMS"] + bookingListInfo["reviewSMS"];
        summary[2].totalCost = summary[2].costPerItem.multiply(summary[2].number);

        summary[summary.length - 1].number = summary[0].number + summary[1].number + summary[2].number;
        summary[summary.length - 1].totalCost = summary[0].totalCost.add(summary[1].totalCost).add(summary[2].totalCost);

        console.log("valid selection response is", response);

        showInformation = true;
    }

</script>

<div class="p-2 flex flex-col justify-center items-center ">
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-2">Service Usage</h1>

    <div class="p-8 flex flex-col justify-center items-center w-fit border-blue-200 rounded-lg border-2 ">
        <div class="flex sm:flex-row flex-col justify-center items-center">
            <span class="text-center mx-1">Select the date to retrieve usage information: </span>
            <Button>Date Select: {selectedOption}
                <ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white"/>
            </Button>
            <Dropdown class="w-48 p-3 space-y-1">
                <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <Radio name="group2" bind:group={selectedOption} value={"monthly"}>Monthly</Radio>
                </li>
                <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <Radio name="group2" bind:group={selectedOption} value={"custom"}>Custom Date Range</Radio>
                </li>
            </Dropdown>
        </div>

        {#if selectedOption === "custom"}
            <Label class="p-4 flex justify-between text-green-800 space-x-4">
                <div class="flex flex-col">
                    <span>Start Date</span>
                    <Input
                            class="border-dashed border-2 border-black"
                            bind:value={startDateSelected}
                            id="date"
                            max={today()}
                            on:click={()=>{showAlert=false}}
                            type="date"
                    />
                </div>
                <div class="flex flex-col items-center">
                    <span>To</span>
                    <span class="my-auto">-</span>
                </div>
                <div class="flex flex-col items-end">
                    <span>End Date</span>
                    <Input
                            class="border-dashed border-2 border-black"
                            bind:value={endDateSelected}
                            id="date"
                            max={today()}
                            on:click={()=>{showAlert=false}}
                            type="date"
                    />
                </div>
            </Label>
        {:else if selectedOption === "monthly"}
            <Label class="p-4 flex justify-between text-green-800 space-x-4">
                <div class="flex flex-col">
                    <Input
                            class="border-dashed border-2 border-black"
                            bind:value={selectedMonth}
                            id="month"
                            max={$now.format(formatToYearMonth)}
                            on:click={()=>{showAlert=false}}
                            type="month"
                    />
                </div>
            </Label>
        {/if}

        {#if selectedOption === "monthly" || selectedOption === "custom" }
            <Alert class="{showAlert?'':'hidden'} bg-none mb-4" params={{ x: 200 }} transition={fly}>
                <InfoCircleSolid class="w-5 h-5 ripple" slot="icon"/>
                <span>{alertMsg}</span>
            </Alert>

            <Button class="" on:click={()=>submitDate()} type="submit">
                Submit
            </Button>
        {/if}
    </div>
</div>

{#if showInformation}
    <h1 class="text-xl font-bold text-center text-gray-800 my-2">
        Usage Information For {summaryDate}
    </h1>
    <div class="flex justify-center items-center">
        <div class="h-auto w-fit overflow-y-auto flex sm:flex-row flex-col sm:items-stretch items-center sm:justify-evenly justify-center text-green-800">

            <div class="flex flex-col min-w-80 w-full p-2 my-1">
                <div class="flex flex-col justify-center items-center w-full h-full">
                    <Card class="h-full">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bookings
                            Made</h5>
                        <Table noborder={true}>
                            <TableHead
                                    class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <TableHeadCell class="px-1">Booking Method</TableHeadCell>
                                <TableHeadCell class="px-1">Amount</TableHeadCell>
                            </TableHead>
                            <TableBody>
                                <TableBodyRow>
                                    <TableBodyCell class="px-1">Lobby</TableBodyCell>
                                    <TableBodyCell class="px-1">{bookingListInfo["lobbyBookings"]}</TableBodyCell>
                                </TableBodyRow>
                                <TableBodyRow>
                                    <TableBodyCell class="px-1">Online</TableBodyCell>
                                    <TableBodyCell class="px-1">{bookingListInfo["onlineBookings"]}</TableBodyCell>
                                </TableBodyRow>
                            </TableBody>
                            <tfoot>
                            <tr class="font-semibold text-gray-900 dark:text-white">
                                <th scope="row" class="py-3 px-1 text-base">Total</th>
                                <td class="py-3 px-1">
                                    {bookingListInfo["lobbyBookings"] + bookingListInfo["onlineBookings"]}</td>
                            </tr>
                            </tfoot>
                        </Table>
                    </Card>
                </div>
            </div>

            <div class="flex flex-col min-w-80 w-full p-2 my-1">
                <div class="flex flex-col justify-center items-center w-full h-full">
                    <Card>
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">SMS Sent</h5>
                        <Table noborder={true}>
                            <TableHead
                                    class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <TableHeadCell class="px-1">SMS Type</TableHeadCell>
                                <TableHeadCell class="px-1">Amount</TableHeadCell>
                            </TableHead>
                            <TableBody>
                                <TableBodyRow>
                                    <TableBodyCell class="px-1">Booking Confirmation</TableBodyCell>
                                    <TableBodyCell class="px-1">{bookingListInfo["confirmationSMS"]}</TableBodyCell>
                                </TableBodyRow>
                                <TableBodyRow>
                                    <TableBodyCell class="px-1">Booking Reminder</TableBodyCell>
                                    <TableBodyCell class="px-1">{bookingListInfo["onlineBookings"]}</TableBodyCell>
                                </TableBodyRow>
                                <TableBodyRow>
                                    <TableBodyCell class="px-1">Review Reminder</TableBodyCell>
                                    <TableBodyCell class="px-1">{bookingListInfo["reviewSMS"]}</TableBodyCell>
                                </TableBodyRow>
                            </TableBody>
                            <tfoot>
                            <tr class="font-semibold text-gray-900 dark:text-white">
                                <th scope="row" class="py-3 px-1 text-base">Total</th>
                                <td class="py-3 px-1">
                                    {bookingListInfo["confirmationSMS"] + bookingListInfo["onlineBookings"] + bookingListInfo["reviewSMS"]}</td>
                            </tr>
                            </tfoot>
                        </Table>
                    </Card>
                </div>
            </div>
        </div>
    </div>

    <!--    <div class="container mx-auto mt-8">-->
    <!--        <h1 class="text-xl font-bold text-center text-gray-800 my-2">-->
    <!--            Summary for {summaryDate}-->
    <!--        </h1>-->
    <!--        <div class="flex flex-col items-center">-->
    <!--            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 min-w-96">-->
    <!--                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">-->
    <!--                    <div class="w-full shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">-->
    <!--                        <table class="min-w-full divide-y divide-gray-200">-->
    <!--                            <thead class="bg-gray-50">-->
    <!--                            <tr>-->
    <!--                                <th scope="col"-->
    <!--                                    class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">-->
    <!--                                    Category-->
    <!--                                </th>-->
    <!--                                <th scope="col"-->
    <!--                                    class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">-->
    <!--                                    Number-->
    <!--                                </th>-->
    <!--                                <th scope="col"-->
    <!--                                    class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">-->
    <!--                                    Cost per Item-->
    <!--                                </th>-->
    <!--                                <th scope="col"-->
    <!--                                    class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">-->
    <!--                                    Total Cost-->
    <!--                                </th>-->
    <!--                            </tr>-->
    <!--                            </thead>-->
    <!--                            <tbody class="bg-white divide-y divide-gray-200">-->
    <!--                            {#each summary as {category, number, costPerItem, totalCost}}-->
    <!--                                <tr>-->
    <!--                                    <td class="px-2 py-4 text-sm font-medium text-gray-900">-->
    <!--                                        {category}-->
    <!--                                    </td>-->
    <!--                                    <td class="px-2 py-4 text-sm text-gray-500">-->
    <!--                                        {number}-->
    <!--                                    </td>-->
    <!--                                    <td class="px-2 py-4 text-sm text-gray-500">-->
    <!--                                        {costPerItem ? `${costPerItem.toFormat('$0,0.00')}` : ''}-->
    <!--                                    </td>-->
    <!--                                    <td class="px-2 py-4 text-sm text-gray-500">-->
    <!--                                        ${totalCost.toFormat('$0,0.00')}-->
    <!--                                    </td>-->
    <!--                                </tr>-->
    <!--                            {/each}-->
    <!--                            </tbody>-->
    <!--                        </table>-->
    <!--                    </div>-->
    <!--                </div>-->
    <!--            </div>-->
    <!--        </div>-->
    <!--    </div>-->
{/if}

<style>
    /*credit: https://stackoverflow.com/questions/51334960/how-to-show-calendar-popup-when-inputtype-date-is-on-focus*/
    :global(input) {
        position: relative;
    }

    :global(input[type="date"]::-webkit-calendar-picker-indicator) {
        background-position: right;
        background-size: auto;
        cursor: pointer;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        width: auto;
        height: auto;
    }

    :global(input[type="month"]::-webkit-calendar-picker-indicator) {
        background-position: right;
        background-size: auto;
        cursor: pointer;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        width: auto;
        height: auto;
    }
</style>