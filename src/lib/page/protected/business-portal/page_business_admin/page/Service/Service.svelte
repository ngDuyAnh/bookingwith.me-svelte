<script>
    import {Accordion, AccordionItem, Button, Spinner} from "flowbite-svelte";
    import {business} from "$lib/page/stores/business/business.js";
    import {handleOpenCreateNewServiceModal} from "$lib/components/Modal/ServiceModal/stores/serviceModal.js";
    import ServiceModal from "$lib/components/Modal/ServiceModal/ServiceModal.svelte";
    import {onMount} from "svelte";
    import {dragHandle, dragHandleZone} from "svelte-dnd-action";
    import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import ServiceList from "$lib/components/Service/ServiceList/ServiceList.svelte";
    import ServiceGroupModal from "$lib/components/Modal/ServiceGroupModal/ServiceGroupModal.svelte";
    import {
        handleOpenCreateNewServiceGroupModal, handleOpenEditServiceGroupModal,
    } from "$lib/components/Modal/ServiceGroupModal/stores/serviceGroupModal.js";

    const flipDurationMs = 200;


    let loading = true;

    onMount(() => {
        loading = false;
    });

    function handleSort(e) {
        business.update((business) => {
            return {...business, serviceGroupList: e.detail.items};
        });
        // serviceList = e.detail.items;
    }

    function handleFinalize(e) {
        business.update((business) => {
            return {...business, serviceGroupList: e.detail.items};
        });

        initializeBusiness($business);
    }

    $: console.log("business", $business);
</script>

{#if loading}
    <div class="flex items-center justify-center w-full h-full">
        <Spinner/>
    </div>
{:else}
    <Accordion class="bg-white">
        <ul
                class="h-full px-4 shadow w-full overflow-y-auto"
                use:dragHandleZone={{ items: $business.serviceGroupList, flipDurationMs }}
                on:consider={(e) => handleSort(e)}
                on:finalize={(e) => handleFinalize(e)}
        >
            {#each $business.serviceGroupList as serviceGroup, index (serviceGroup.id)}
                <AccordionItem>
                    <div slot="header" class="flex items-center w-full relative">
                        <div
                                use:dragHandle
                                aria-label="drag-handle for {index}"
                                class="absolute left-0 text-green-400"
                        >
                            <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40px"
                                    height="40px"
                                    viewBox="0 0 24 24"
                                    fill="current"
                            >
                                <path
                                        d="M15 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM15 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM15 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM9 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM9 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM9 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                        stroke="#8a8a8a"
                                        stroke-width="1"
                                        stroke-miterlimit="10"
                                />
                            </svg>
                        </div>
                        <div
                                class="flex flex-col sm:flex-row justify-between w-full items-center text-center sm:text-left ml-[40px]"
                        >
              <span class="font-semibold mb-2 sm:mb-0 sm:mr-3"
              >{serviceGroup.serviceGroupName}</span
              >
                            <span class="mr-4 text-sm text-gray-500 flex-1"
                            >{serviceGroup.description}</span
                            >
                            <Button
                                    class="mr-4"
                                    on:click={() => handleOpenCreateNewServiceModal(serviceGroup)}
                            >Add new service
                            </Button>
                            <Button
                                    class="mr-4"
                                    on:click={() => handleOpenEditServiceGroupModal(serviceGroup)}
                            >Edit
                            </Button>
                        </div>
                    </div>

                    <ServiceList bind:serviceList={serviceGroup.serviceList}/>
                </AccordionItem>
            {/each}
        </ul>
    </Accordion>
{/if}

<div class="mt-4">
    <Button on:click={handleOpenCreateNewServiceGroupModal}>Add New Service Group</Button>
</div>

<!--Modal create or edit service group-->
<ServiceGroupModal/>

<!--Modal create or edit service-->
<ServiceModal/>
