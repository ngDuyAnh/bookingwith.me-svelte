<script>
    import {Accordion, AccordionItem} from "flowbite-svelte";
    import ServiceOption
        from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/ServiceOption.svelte";
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline, ArrowLeftOutline } from 'flowbite-svelte-icons';

    export let business
    export let gotoNumGuestSelect;
    export let gotoCustomerBookingInformation;
    export let customerIndividualBookingList;

    export let guestIndex = 0;

    function handlePrev()
    {
        if (guestIndex === 0)
        {
            gotoNumGuestSelect();
        }
        else
        {
            guestIndex--;
        }
    }

    function handleNext()
    {
        if (guestIndex === (customerIndividualBookingList.length - 1))
        {
            // Check if all guest has selected at least a service
            let allGuestSelectedService = true;
            if (allGuestSelectedService)
            {
                gotoCustomerBookingInformation();
            }
            else
            {
                alert("At least one guest has not selected a service!");
            }
        }
        else
        {
            guestIndex++;
        }
    }
</script>

<div class="h-full w-full">
    <div class="flex justify-between items-center px-6 pt-4 w-full">
        <Button pill={true} on:click={handlePrev} class="!p-2"><ArrowLeftOutline class="w-6 h-6" /></Button>
        <h1 class="text-xl font-semibold flex-grow-0 ">
            Guest #{guestIndex + 1}
        </h1>
        <Button pill={true} on:click={handleNext} class="!p-2"><ArrowRightOutline class="w-6 h-6" /></Button>
    </div>

    <!-- Customer individual service select -->
    <div class="mt-3">
        <Accordion>
            {#each business.serviceGroupList as serviceGroup, index}
                <AccordionItem open={index === 0} class="bg-gray-100">
                    <div slot="header" class="flex items-center w-full">
                        <div class="flex flex-col sm:flex-row justify-between w-full items-center text-center sm:text-left">
                            <span class="font-semibold mb-2 sm:mb-0 sm:mr-3">{serviceGroup.serviceGroupName}</span>
                            <span class="mr-4 text-sm text-gray-500 flex-1">{serviceGroup.description}</span>
                        </div>
                    </div>

                    {#each serviceGroup.serviceList as service}
                        <ServiceOption
                                {service}
                                customerIndividualBooking={customerIndividualBookingList[guestIndex]}
                        />
                    {/each}
                </AccordionItem>
            {/each}
        </Accordion>
    </div>
</div>
