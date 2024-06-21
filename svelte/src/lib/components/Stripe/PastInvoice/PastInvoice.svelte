<script>
    import {onMount} from 'svelte'
    import {Button, Card, Input, Label, Modal} from "flowbite-svelte";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToYearMonth} from "$lib/application/Formatter.js";
    import dayjs from "dayjs";

    export let customerId;

    let invoices = [];

    let loading = true;
    let selectedMonth = $now.format(formatToYearMonth);
    let startDateSelected = null;
    let endDateSelected = null;
    let submitInvoice = false;
    let openInvoice = false;

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
        await submitInvoiceDate();
        loading = false;
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

<Modal title="Past Invoices" bind:open={openInvoice} classBackdrop="absolute top-0 left-0">
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
        {#if invoice.amount_due !== 0}
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