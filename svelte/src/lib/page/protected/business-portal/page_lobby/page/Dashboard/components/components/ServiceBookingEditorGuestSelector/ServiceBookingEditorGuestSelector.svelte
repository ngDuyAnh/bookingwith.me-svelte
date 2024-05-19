<script>
    import {Spinner} from "flowbite-svelte";
    import GuestSelect from "$lib/components/BookingComponents/GuestSelect/GuestSelect.svelte";
    import {businessInfo} from "$lib/page/protected/business-portal/page_admin/stores/business_portal_admin_store.js";
    import {
        customerIndividualList,
        pageIndex
    } from "$lib/page/protected/business-portal/page_admin/stores/service_editor_store.js";
    import {onMount} from "svelte";

    let selectedNumGuests;

    // Wait for the businessInfo fetching to be done
    let loading = true;
    $: if ($businessInfo) {
        loading = false;
    }

    function handleSubmit() {
        // Update the customer individual list
        let diff = Math.abs($customerIndividualList.length - selectedNumGuests);
        if (selectedNumGuests < $customerIndividualList.length) {
            customerIndividualList.update(list => {
                return list.slice(0, list.length - diff);
            });
        } else if (selectedNumGuests > $customerIndividualList.length) {
            customerIndividualList.update(list => {
                for (let i = 0; i < diff; i++) {
                    list.push([]);
                }
                return list;
            });
        }
        console.log("selectedNumGuests", selectedNumGuests);
        console.log("customerIndividualList", $customerIndividualList);
        // Go to the next page to get the customer individual booking information
        pageIndex.set($pageIndex + 1);
    }

    onMount(() => {

        selectedNumGuests = $customerIndividualList.length;

        console.log("selectedNumGuests", selectedNumGuests);
        console.log("$customerIndividualList", $customerIndividualList);
    });
</script>
<div class="flex justify-center items-center h-[85%]">
    {#if loading}
        <Spinner/>
    {:else}
        <GuestSelect
                businessInfo={$businessInfo.business}
                handleSubmit={handleSubmit}
                bind:selectedNumGuests={selectedNumGuests}
        />
    {/if}
</div>