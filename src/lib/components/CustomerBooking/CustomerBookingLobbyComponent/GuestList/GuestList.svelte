<script>
    import {Tooltip} from "flowbite-svelte";
    import {UserOutline, UserSolid} from "flowbite-svelte-icons";
    import {onMount} from "svelte";

    export let nextCol;
    export let customerBooking;
    export let selectedIndividualBookingIndex;

    // Function to handle the deletion of an individual booking
    function deleteGuest(index) {
        // Always keep at least one guest
        if (customerBooking.customerIndividualBookingList.length > 1) {
            if (customerBooking.customerIndividualBookingList[index].customerIndividualServiceBookingList.length === 0 ||
                confirm('Are you sure you want to delete this guest?')) {
                customerBooking.customerIndividualBookingList = [
                    ...customerBooking.customerIndividualBookingList.slice(0, index),
                    ...customerBooking.customerIndividualBookingList.slice(index + 1)
                ];

                if (selectedIndividualBookingIndex >= index && selectedIndividualBookingIndex > 0) {
                    selectedIndividualBookingIndex -= 1;
                }
            }
        }
    }

    let screenWidth;

    onMount(() => {
        screenWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            screenWidth = window.innerWidth;
        });
    });

    function handleButtonClick(index) {
        selectedIndividualBookingIndex = index;
        //  768px for 'md' in Tailwind
        if (screenWidth < 768) {
            nextCol();
        }
    }
</script>

<ul class="flex-grow mt-4 space-y-2 px-2">
    {#each customerBooking.customerIndividualBookingList as individualBooking, index (index)}
        <li id={index}
            class="flex justify-between items-center {selectedIndividualBookingIndex === index ? 'bg-blue-50 py-2 border-[1px] border-blue-700':'bg-gray-100 py-1'} px-1 rounded-md shadow-sm ">
            <button
                    on:click={() => { handleButtonClick(index);}}
                    class="flex-1 text-left cursor-pointer"
            >
                <span class="flex items-center text-gray-950">
                    {#if selectedIndividualBookingIndex === index}
                        <UserSolid class="mr-2 h-5 w-5 text-gray-700"/>
                    {:else}
                        <UserOutline class="mr-2 h-5 w-5 text-gray-700"/>
                    {/if}

                    <span class="text-gray-950"> Guest #{index + 1}
                        (<span class="{individualBooking.customerIndividualServiceBookingList.length>0? '':'text-red-600'}">{individualBooking.customerIndividualServiceBookingList.length}</span>)
                    </span>
                </span>
            </button>

            {#if customerBooking.customerIndividualBookingList.length > 1}
                <button
                        on:click={() => deleteGuest(index)}
                        class="ml-4 text-red-500 cursor-pointer"
                >
                    <svg class="w-4 h-4 text-red-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                         viewBox="0 0 448 512">
                        <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                </button>
                <Tooltip class="z-[1050]" type="light">Delete Guest</Tooltip>
            {/if}
        </li>
    {/each}
</ul>
