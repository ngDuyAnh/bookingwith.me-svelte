<script>
    import {onMount} from 'svelte'
    import {
        Avatar,
        Button,
        Card,
        Input,
        Label,
        Modal,
        Spinner,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";
    import {now} from "$lib/page/stores/now/now.js";
    import {formatToYearMonth} from "$lib/application/Formatter.js";
    import dayjs from "dayjs";

    export let customerId;

    let invoices = [];

    let selectedMonth = $now.format(formatToYearMonth);
    let startDateSelected = null;
    let endDateSelected = null;
    let submitInvoice = false;
    let openInvoice = false;

    async function getInvoices() {
        const response = await fetch('/api/stripe/check/invoices/get-by-month', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({customerId, startOfMonth: startDateSelected, endOfMonth: endDateSelected}),
        });

        const result = await response.json();
        invoices =[];
        if (result.invoices) {
            result.invoices.forEach(invoice => {
                if (invoice.status === 'paid') {
                    if(invoice.amount_paid !== 0)
                    {
                        invoices.push(invoice);
                    }
                } else if (invoice.status !== 'paid')  {
                    invoices.push(invoice);
                }

            });
    // console.log("invoices are", invoices);
        } else if (result.error) {
            console.error(result.error);
        }

        submitInvoice = false;
    }

    onMount(async () => {
        await submitInvoiceDate();
    })


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

    $:console.log("invoices", invoices);

</script>

<Card>
    <Button disabled={openInvoice} on:click={()=> { openInvoice=true}} type="submit">
        View Past Invoices
    </Button>
</Card>

<div class="absolute top-0 left-0">
<Modal title="Past Invoices" bind:open={openInvoice} outsideclose>
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
    {#if submitInvoice}
        <div class="flex w-full justify-center">
            <Spinner/>
        </div>
    {:else}


        <Table>
            <TableHead
                    class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <TableHeadCell class="px-1 flex flex-row items-center">
                    <Avatar size="xs"/>
                    Amount $CAD
                </TableHeadCell>
                <TableHeadCell class="px-1">Status</TableHeadCell>
                <TableHeadCell class="px-1">Created</TableHeadCell>
                <TableHeadCell class="px-1">Full Invoice</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each invoices as invoice}
                    <!--{#if invoice.amount_due !== 0}-->
                        <TableBodyRow>
                            <TableBodyCell class="px-1"><p class="font-normal text-gray-700 dark:text-gray-400">
                                ${invoice.amount_due / 100} {invoice.currency.toUpperCase()}</p></TableBodyCell>

                            <TableBodyCell class="px-1"><p class="font-normal text-gray-700 dark:text-gray-400">
                                {invoice.status}</p></TableBodyCell>

                            <TableBodyCell class="px-1"><p class="font-normal text-gray-700 dark:text-gray-400">
                                {new Date(invoice.created * 1000).toLocaleDateString()}</p></TableBodyCell>

                            <TableBodyCell class="px-1"><a href={invoice.hosted_invoice_url} target="_blank">
                                View</a></TableBodyCell>
                        </TableBodyRow>
                    <!--{/if}-->
                {/each}
            </TableBody>
        </Table>
    {/if}
    <svelte:fragment slot="footer">
        {#key invoices}
        Total # of Invoices: {invoices.length}
        {/key}
    </svelte:fragment>

</Modal>
</div>