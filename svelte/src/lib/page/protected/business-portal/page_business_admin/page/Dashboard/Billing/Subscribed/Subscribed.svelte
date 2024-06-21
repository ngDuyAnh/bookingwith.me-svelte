<script>
    import {onMount} from 'svelte'
    import {
        Button,
        Card,
        Input,
        Label, Modal,
        Spinner,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";
    import PaymentCard from "$lib/components/Stripe/PaymentCard/PaymentCard.svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToYearMonth} from "$lib/application/Formatter.js";
    import dayjs from "dayjs";
    import PastInvoice from "$lib/components/Stripe/PastInvoice/PastInvoice.svelte";


    let usage = {lobby: 4, online: 3, sms: 2};
    export let paymentMethod;
    export let customerId;


    let stripe = null;
    let error = null;
    let invoices = [];

    let loading = true;
    let selectedMonth = $now.format(formatToYearMonth);
    let startDateSelected = null;
    let endDateSelected = null;
    let upcomingInvoice = null;
    let submitInvoice = false;
    let openInvoice=false;

    async function getInvoices() {
        const response = await fetch('/stripe/check/invoices/get-by-month', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({customerId, startOfMonth: startDateSelected, endOfMonth: endDateSelected}),
        });

        const result = await response.json();
        if (result.invoices) {
            invoices = result.invoices;
        } else if (result.error) {
            console.error(result.error);
        }

        submitInvoice = false;
    }

    onMount(async () => {
        await getUpcomingInvoice();
        // await submitInvoiceDate();
        loading = false;
    })


    async function reportUsage() {
        const response = await fetch('/stripe/reportUsage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: customerId,
                usage: usage
            })
        });

        console.log("response", response);
    }

    async function submitInvoiceDate() {
        submitInvoice = true;
        console.log("selectedMonth", selectedMonth);
        let month = dayjs(selectedMonth);
        let startDate = month.startOf('month');
        let endDate = month.add(month.daysInMonth() - 1, "day");
        startDateSelected = startDate.startOf('month').unix();
        endDateSelected = endDate.unix();

        await getInvoices();
    }

    async function getUpcomingInvoice(customerId) {
        const response = await fetch('/stripe/check/invoices/upcoming', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({customerId}),
        });

        const result = await response.json();
        if (result.upcomingInvoice) {
            upcomingInvoice = result.upcomingInvoice;
            console.log("upcomingInvoice", upcomingInvoice);
        } else if (result.error) {
            console.error(result.error);
        }
    }

    $:console.log("customer usage inc", usage);
    $:console.log("paymentMethod", paymentMethod);
    $:console.log("invoices", invoices);
</script>

<div class="flex flex-col justify-center items-center">
    {#if loading}
        <Spinner/>
    {:else}



        <div class="h-auto max-w-md flex flex-col justify-center items-center space-y-3">
            <span>
            You have An Active Subscription to bookingwith.me.
        </span>
            <PaymentCard
                    bind:paymentMethod={paymentMethod}
            />
            <Card>
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Upcoming Invoice</h5>
                {#if upcomingInvoice}
                    <Table noborder={true}>
                        <TableHead
                                class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                            <TableHeadCell class="px-1">Product Description</TableHeadCell>
                            <TableHeadCell class="px-1">Price</TableHeadCell>
                        </TableHead>
                        <TableBody>
                            {#each upcomingInvoice.lines.data as data}
                                <TableBodyRow>
                                    <TableBodyCell class="px-1">{data.description}</TableBodyCell>
                                    <TableBodyCell class="px-1">${data.amount / 100}</TableBodyCell>
                                </TableBodyRow>
                            {/each}
                        </TableBody>
                        <tfoot>
                        <tr class="font-semibold text-gray-900 dark:text-white">
                            <th scope="row" class="py-3 px-1 text-base">Total</th>
                            <td class="py-3 px-1">
                                ${upcomingInvoice.amount_due / 100} {upcomingInvoice.currency.toUpperCase()}</td>
                        </tr>
                        </tfoot>
                    </Table>
                    <p class="font-normal text-gray-700 dark:text-gray-400">
                        <strong>Status:</strong> {upcomingInvoice.status}</p>
                    <p class="font-normal text-gray-700 dark:text-gray-400">
                        <strong>Due:</strong> {new Date(upcomingInvoice.created * 1000).toLocaleDateString()}</p>

                {:else}
                    <p>No upcoming invoice found.</p>
                {/if}
            </Card>

            <PastInvoice
                    {customerId}
            />

        </div>

        <!--        <div class="flex flex-col items-center space-y-2">-->
        <!--            {#if error}-->
        <!--                <p class="error">{error.message} Please try again.</p>-->
        <!--            {/if}-->

        <!--            <div class="flex flex-row items-center space-x-2">-->
        <!--                <Button on:click={()=>{usage.lobby++;}}>-->
        <!--                    +Lobby-->
        <!--                </Button>-->
        <!--                <Button on:click={()=>{usage.online++;}}>-->
        <!--                    +Online-->
        <!--                </Button>-->
        <!--                <Button on:click={()=>{usage.sms++;}}>-->
        <!--                    +SMS-->
        <!--                </Button>-->
        <!--            </div>-->

<!--        <Button on:click={reportUsage}>-->
<!--            Report Usage-->
<!--        </Button>-->
        <!--        </div>-->
    {/if}
</div>

<Modal title="Past Invoices" bind:open={openInvoice}>
    <Label class="p-4 flex justify-between text-green-800 space-x-5">
        <div class="flex flex-row space-x-1">
            <Input
                    class="border-dashed border-2 border-black"
                    bind:value={selectedMonth}
                    id="month"
                    max={$now.format(formatToYearMonth)}
                    type="month"
            />
            <Button disabled={submitInvoice} on:click={()=>submitInvoiceDate()} type="submit">
                Submit
            </Button>
        </div>
    </Label>

    {#each invoices as invoice}
        {#if invoice.amount_due != 0}
            <Card class="my-1">
                <p class="font-normal text-gray-700 dark:text-gray-400">
                    <strong>Amount:</strong> {invoice.amount_due / 100} {invoice.currency.toUpperCase()}</p>
                <p class="font-normal text-gray-700 dark:text-gray-400">
                    <strong>Status:</strong> {invoice.status}
                </p>
                <p class="font-normal text-gray-700 dark:text-gray-400">
                    <strong>Created:</strong> {new Date(invoice.created * 1000).toLocaleDateString()}</p>

                <a href={invoice.hosted_invoice_url} target="_blank">View</a>
            </Card>
        {/if}
    {/each}

</Modal>