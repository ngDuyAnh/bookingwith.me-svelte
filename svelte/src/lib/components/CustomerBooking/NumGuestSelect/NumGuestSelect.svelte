<script>
    import {Button} from "flowbite-svelte";

    export let businessInfo;
    export let gotoCustomerIndividualBookingServiceSelect;
    export let selectedNumGuests;
</script>

<div class="flex flex-col items-center justify-center h-full w-full">
    <h1 class="text-2xl text-gray-700 select-none">
        Welcome to {businessInfo.businessName}
    </h1>
    <form class="select-none max-w-sm mx-auto bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800" on:submit|preventDefault={gotoCustomerIndividualBookingServiceSelect(selectedNumGuests)}>
        <label for="zip-input" class="block text-sm font-medium text-gray-900 dark:text-white text-center mb-4">
            Please select the number of guests:
        </label>
        <input
                type="number"
                id="zip-input"
                aria-describedby="helper-text-explanation"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full"
                placeholder="1 to 9"
                min="1"
                max="9"
                pattern="^[1-9]\d*$"
                inputmode="numeric"
                bind:value={selectedNumGuests}
                required
        />
        <Button
                type="submit"
                class="mt-4 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Submit
        </Button>
    </form>

</div>
