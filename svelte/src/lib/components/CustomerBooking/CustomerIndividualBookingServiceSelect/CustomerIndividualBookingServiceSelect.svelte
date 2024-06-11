<script>
    import {Accordion, AccordionItem, Alert, Button} from "flowbite-svelte";
    import ServiceOption
        from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/ServiceOption.svelte";
    import {ArrowLeftOutline, ArrowRightOutline, InfoCircleSolid} from 'flowbite-svelte-icons';
    import {fly} from 'svelte/transition';
    import {selectedServiceIds} from "$lib/page/stores/selectedServiceIds/selectedServiceIds.js";

    export let business
    export let gotoNumGuestSelect;
    export let gotoCustomerBookingInformation;
    export let customerIndividualBookingList;

    export let guestIndex = 0;

    let showAlert = false;
    let alertMsg = "";

    function handlePrev() {
        showAlert = false;
        if (guestIndex === 0) {
            gotoNumGuestSelect();
        } else {
            guestIndex--;
        }
    }

    function checkForGuestsWithNoServices() {
        return customerIndividualBookingList
            .map((booking, index) => booking.customerIndividualServiceBookingList.length === 0 ? index + 1 : -1)
            .filter(index => index !== -1);
    }


    function handleNext() {
        showAlert = false;
        alertMsg = "";
        if (guestIndex === (customerIndividualBookingList.length - 1)) {
            let allGuestSelectedService = checkForGuestsWithNoServices();

            if (allGuestSelectedService.length === 0) {
                gotoCustomerBookingInformation();
            } else {
                showAlert = true;
                if (allGuestSelectedService.length <= 4) {
                    if (allGuestSelectedService.length === 4) {
                        alertMsg = `Guests # ${allGuestSelectedService.slice(0, -1).join(', ')} & ${allGuestSelectedService.slice(-1)} have not selected a service.`;
                    } else {
                        alertMsg = `Guest${allGuestSelectedService.length > 1 ? 's' : ''} # ${allGuestSelectedService.join(' & ')} have not selected a service.`;
                    }
                } else {
                    alertMsg = `${allGuestSelectedService.length} guests have not selected a service.`;
                }
            }
        } else {
            guestIndex++;
        }
    }

    $: {
        // console.log("Update selectedServiceIds", selectedIds);

        const selectedIds = new Set(customerIndividualBookingList[guestIndex]?.customerIndividualServiceBookingList.map(serviceBooking => serviceBooking.service.id));
        selectedServiceIds.set(selectedIds);
    }
</script>


<style>

    :global(.ripple) {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px red solid;
        animation: pulse 1s infinite;
    }

    @-webkit-keyframes pulse {
        0% {
            -webkit-box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
        }
        70% {
            -webkit-box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
        }
        100% {
            -webkit-box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
        }
    }
</style>


<div class="h-full w-full">
    <div class="flex justify-between items-center px-6 py-4 w-full">
        <Button class="disable-double-tap-zoom !p-2" on:click={handlePrev} pill={true}>
            <ArrowLeftOutline class="w-6 h-6"/>
        </Button>
        <h1 class="text-xl font-semibold flex-grow-0 ">
            Guest #{guestIndex + 1}
        </h1>
        <Button class="disable-double-tap-zoom !p-2" on:click={handleNext} pill={true}>
            <ArrowRightOutline class="w-6 h-6"/>
        </Button>
    </div>
    <Alert class="{showAlert?'':'hidden'}" dismissable params={{ x: 200 }} transition={fly}>
        <InfoCircleSolid class="w-5 h-5 ripple" slot="icon"/>
        {alertMsg}
    </Alert>
    <!-- Customer individual service select -->
    <div class="mt-3">
        <Accordion>
            {#each business.serviceGroupList as serviceGroup, index}
                <AccordionItem open={index === 0} class="bg-gray-100">
                    <div slot="header" class="flex items-center w-full">
                        <div class="flex flex-col sm:flex-row items-center justify-between w-full  text-center sm:text-left">
                            <span class="font-semibold mb-2 sm:mb-0 sm:mr-3">{serviceGroup.serviceGroupName}</span>
                            <span class="text-sm text-gray-500 flex-1">{serviceGroup.description}</span>
                        </div>
                    </div>

                    {#key guestIndex}
                        {#each serviceGroup.serviceList as service}
                            <ServiceOption
                                    {service}
                                    customerIndividualBooking={customerIndividualBookingList[guestIndex]}
                                    serviceGroup={serviceGroup.serviceList}
                                    multiselect={serviceGroup.multiselect}
                            />
                        {/each}
                    {/key}
                </AccordionItem>
            {/each}
        </Accordion>
    </div>
</div>

