<script>
    import {Button, Input} from "flowbite-svelte";

    export let businessInfo;
    export let gotoCustomerIndividualBookingServiceSelect;
    export let selectedNumGuests;
</script>

<div class="flex flex-col items-center justify-center h-full w-full">
    <h1 class="text-2xl text-gray-700 select-none">
        Welcome to {businessInfo.businessName}
    </h1>
    <form
            class="select-none max-w-sm mx-auto bg-white p-6 rounded-lg"
            on:submit={() => {
                gotoCustomerIndividualBookingServiceSelect(selectedNumGuests)
            }}
    >
        <span>
            Please select the number of guests:
        </span>
        <Input
                type="number"
                inputmode="numeric"

                placeholder="1 to 9"
                min="1"
                max="9"

                bind:value={selectedNumGuests}

                required
        />
        <Button
                class="disable-double-tap-zoom mt-4 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="submit"
        >
            Submit
        </Button>
    </form>
</div>
