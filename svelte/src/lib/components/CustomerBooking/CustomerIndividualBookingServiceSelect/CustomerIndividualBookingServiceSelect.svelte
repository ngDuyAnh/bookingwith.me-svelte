<script>
    import {Accordion, AccordionItem} from "flowbite-svelte";
    import ServiceOption
        from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/ServiceOption.svelte";

    export let business
    export let gotoNumGuestSelect;
    export let gotoCustomerBookingInformation;
    export let customerIndividualBookingList;

    let guestIndex = 0;

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
            gotoCustomerBookingInformation();
        }
        else
        {
            guestIndex++;
        }
    }
</script>

<div class="h-full w-full">
    <div class="flex justify-between items-center px-4 pt-4 w-full">
        <button
                class="flex items-center justify-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 ease-in-out"
                on:click={handlePrev}
                aria-label="Previous"
        >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12l4-4m-4 4 4 4"/>
            </svg>
        </button>
        <h1 class="text-xl font-semibold flex-grow-0 ">
            Guest #{guestIndex + 1}
        </h1>
        <button
                class="flex items-center justify-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-150 ease-in-out"
                on:click={handleNext}
                aria-label="Next"
        >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0l-4 4m4-4-4-4"/>
            </svg>
        </button>
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
