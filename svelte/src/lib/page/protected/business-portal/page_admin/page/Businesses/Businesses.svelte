<script>

    import {
        Button,
        Spinner,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell, Toast
    } from "flowbite-svelte";
    import {onMount} from "svelte";
    import {
        getBusiness, getBusinessIDList,
        getCustomerBookingList,
        initializeBusiness
    } from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import {CustomerBookingChannel} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {today} from "$lib/page/stores/now/now_dayjs_store.js";
    import {slide} from "svelte/transition";
    import {CheckCircleSolid, CloseCircleSolid} from "flowbite-svelte-icons";
    import dayjs from "dayjs";
    import {formatToDate} from "$lib/application/Formatter.js";

    let allBusinessIDList = [];

    let businesses = []
    let loading = true;

    function totalUsageInformation() {
        return {
            "lobby": 0,
            "online": 0,
            "sms": 0
        }
    }

    async function getAllBusinessIDList (){
        const {businessIDList} = await getBusinessIDList();

        return businessIDList;
    }

    async function getBookingInformation(businessID, startDate, endDate) {
        const response = await getCustomerBookingList(businessID, startDate, endDate);

        let usage = totalUsageInformation();
        for (let res in response) {

            switch (response[res]["bookingChannel"]) {
                case CustomerBookingChannel.LOBBY: {
                    usage["lobby"] += 1;
                    break;
                }
                case CustomerBookingChannel.ONLINE: {
                    usage["online"] += 1;
                    break;
                }
            }

            if (response[res]["smsAppointmentReminderSid"]) {
                usage["sms"] += 1;
            }

            if (response[res]["smsConfirmationSent"]) {
                usage["sms"] += 1;
            }

            if (response[res]["smsReviewReminderSent"]) {
                usage["sms"] += 1;
            }

        }

        console.log("valid selection response is", response);
        console.log("usage is", usage);

        return usage;
    }

    let errorMessage="";
    let toastStatus = false;
    let counter = 6;

    function trigger() {
        toastStatus = true;
        counter = 6;
        timeout();
    }

    function timeout() {
        if (--counter > 0) return setTimeout(timeout, 1000);
        toastStatus = false;
    }


    async function reportUsage(business, index) {
        errorMessage="";
        try{
            if(business.businessInfo.stripeLastReportedDate && dayjs(business.businessInfo.stripeLastReportedDate).isSame(today()))
            {
                errorMessage="Already Reported Usage For Today!"
                trigger();
                return;
            }

            let startDate = dayjs(business.businessInfo.stripeLastReportedDate).add(1,"day").format(formatToDate);
            let endDate = today();

            if(dayjs(endDate).isBefore(startDate))
            {
                startDate=endDate;
            }

            const usage = await getBookingInformation(business.businessInfo.businessID);

            const response = await fetch('/api/stripe/reportUsage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customerId: business.businessInfo.stripeID,
                    usage: usage
                })
            });

            business.businessInfo.stripeLastReportedDate=today();

            businesses[index]=business;

            await initializeBusiness(business);

            console.log("response", response);

        }catch(error)
        {
            errorMessage="Unknown Error Occurred";
            console.log(error)
        }
    }

    onMount(async () => {
        loading = true;
        allBusinessIDList = await getAllBusinessIDList ();

        for (let id of allBusinessIDList) {
            businesses.push(await getBusiness(id))
        }
        loading = false;

        console.log("businesses",businesses);
    });


</script>

<div class="flex flex-col w-full h-full justify-center items-center">
{#if loading}
    <Spinner/>
{:else}
    <h1>Dashboard</h1>
    <div class="w-fit justify-center">
        <Table striped={true} class="rounded-lg" shadow={true}>
            <TableHead
                    class="rounded-lg text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 ">
                <TableHeadCell class="rounded-tl-lg px-1 border-r">Business</TableHeadCell>
                <TableHeadCell class="px-1 border-r">Last Usage Submission Date</TableHeadCell>
                <TableHeadCell class="rounded-tr-lg px-1">Submit Usage</TableHeadCell>
            </TableHead>
            <TableBody >
                {#each businesses as business, ind}
                    <TableBodyRow>
                        <TableBodyCell class="px-1 border-r">{business.businessInfo.businessName}</TableBodyCell>
                        <TableBodyCell class="px-1 border-r">{business.businessInfo.stripeLastReportedDate}</TableBodyCell>
                        <TableBodyCell class="px-1"><Button on:click={()=>reportUsage(business, ind)}>Report Usage</Button></TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    </div>
    <Toast color="red" class="mt-4 w-auto p-4 flex items-center justify-center" dismissable={false}
           position="bottom-right" bind:open={toastStatus}>
        <CloseCircleSolid slot="icon" class="w-5 h-5"/> {errorMessage}
    </Toast>
{/if}

</div>