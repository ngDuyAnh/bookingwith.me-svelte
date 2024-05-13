<script>
    import {
        businessInfo,
        pageIndex,
        customerIndividualList
    } from "$lib/page/customer-booking-portal/create/stores/customer_booking_portal_create_store.js";
    import {Spinner} from "flowbite-svelte";

    let selectedNumGuests = $customerIndividualList.length;

    // Wait for the businessInfo fetching to be done
    let loading = true;
    $: if ($businessInfo)
    {
        loading = false;
    }

    function handleSubmit()
    {
        // Update the customer individual list
        let diff = Math.abs($customerIndividualList.length - selectedNumGuests);
        if (selectedNumGuests < $customerIndividualList.length)
        {
            customerIndividualList.update(list => {
                return list.slice(0, list.length - diff);
            });
        }
        else if (selectedNumGuests > $customerIndividualList.length)
        {
            customerIndividualList.update(list => {
                for (let i = 0; i < diff; i++) {
                    list.push([]);
                }
                return list;
            });
        }

        // Go to the next page to get the customer individual booking information
        pageIndex.set($pageIndex + 1);
    }
</script>

{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner />
    </div>
{:else}
    <div class="flex flex-col items-center justify-center min-h-screen w-full">
        <h1>
            Welcome to {$businessInfo.businessName}
        </h1>

        <form class="max-w-sm mx-auto" on:submit|preventDefault={handleSubmit}>
            <label for="zip-input" class="block text-sm font-medium text-gray-900 dark:text-white text-center">
                Please select the number of guests:
            </label>
            <input type="number" id="zip-input" aria-describedby="helper-text-explanation"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500   p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="1 to 9" min="1" max="" pattern="^[1-9]\d*$" bind:value={selectedNumGuests} required/>
            <button type="submit"
                    class="mt-4 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Submit
            </button>
        </form>
    </div>
{/if}
