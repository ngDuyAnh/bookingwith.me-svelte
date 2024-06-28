<script>
    import {Button, Card} from "flowbite-svelte";
    import dinero from "dinero.js";
    import {CustomerBookingCost} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {CheckCircleSolid} from "flowbite-svelte-icons";


    export let subscriptionStep;


    function submit(){
        subscriptionStep=1;
    }


</script>

<div class="p-2 flex flex-col justify-center items-center ">

    <Card padding="xl">
        <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Standard Plan</h5>
        <div class="flex items-baseline text-gray-900 dark:text-white">
            <span class="text-3xl font-semibold">$</span>
            <span class="text-5xl font-extrabold tracking-tight">0</span>
            <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
        </div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Monthly subscription with pay-as-you-go pricing</p>
        <ul class="my-7 space-y-4">
            <li class="flex space-x-2 rtl:space-x-reverse">
                <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                <span class="text-sm font-normal leading-tight text-gray-500 dark:text-gray-400">{dinero({amount: CustomerBookingCost.LOBBY, currency: 'CAD'}).toFormat('$0,0.00')} per Lobby Booking</span>
            </li>
            <li class="flex space-x-2 rtl:space-x-reverse">
                <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                <span class="text-sm font-normal leading-tight text-gray-500 dark:text-gray-400">{dinero({amount: CustomerBookingCost.ONLINE, currency: 'CAD'}).toFormat('$0,0.00')} per Online Booking</span>
            </li>
            <li class="flex space-x-2 rtl:space-x-reverse">
                <CheckCircleSolid class="w-4 h-4 text-primary-600 dark:text-primary-500" />
                <span class="text-sm font-normal leading-tight text-gray-500 dark:text-gray-400">{dinero({amount: CustomerBookingCost.SMS, currency: 'CAD'}).toFormat('$0,0.00')} per SMS sent</span>
            </li>
        </ul>
        <Button class="w-full" on:click={submit}>Subscribe Now</Button>
    </Card>
</div>
