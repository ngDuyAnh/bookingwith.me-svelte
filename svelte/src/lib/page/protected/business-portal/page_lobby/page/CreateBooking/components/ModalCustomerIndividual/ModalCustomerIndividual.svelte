<script>
    import {Accordion, AccordionItem, Modal} from 'flowbite-svelte';
    import ServiceOption
        from "$lib/page/protected/business-portal/page_lobby/page/CreateBooking/components/ModalCustomerIndividual/EmployeeSelect/ServiceOption.svelte";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";

    export let open = false;
    export let customerIndividualIndex;
    export let customerIndividual;
</script>

<Modal bind:open={open} size="lg" outsideclose>
    <!-- Header showing the customer index -->
    <div class="text-lg font-semibold mb-4">
        Select Services for Customer {customerIndividualIndex + 1}
    </div>

    <div class="mt-6">
        <Accordion>
            {#each $businessInfo.serviceGroupList as serviceGroup, index}
                <AccordionItem open={index === 0}>
                    <div slot="header" class="flex items-center w-full">
                        <div class="flex flex-col sm:flex-row justify-between w-full items-center text-center sm:text-left">
                            <span class="font-semibold mb-2 sm:mb-0 sm:mr-3">{serviceGroup.serviceGroupName}</span>
                            <span class="mr-4 text-sm text-gray-500 flex-1">{serviceGroup.description}</span>
                        </div>
                    </div>

                    {#each serviceGroup.serviceList as service}
                        <ServiceOption
                                {service}
                                {customerIndividual}
                        />
                    {/each}
                </AccordionItem>
            {/each}
        </Accordion>
    </div>
</Modal>
