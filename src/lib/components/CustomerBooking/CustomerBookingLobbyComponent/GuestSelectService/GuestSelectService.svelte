<script>
    import SelectServiceBooking
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/GuestSelectService/components/SelectServiceBooking/SelectServiceBooking.svelte";
    import {UserSolid} from "flowbite-svelte-icons";
    import ServiceBooking
        from "$lib/components/CustomerBooking/CustomerBookingLobbyComponent/GuestSelectService/components/ServiceBooking/ServiceBooking.svelte";

    export let customerBooking;
    export let individualBookingIndex;
    export let selectedSomething;

    // Reactive variables to store totals
    let totalServiceCost = 0;
    let totalServiceTimeLength = 0;

    $: individualBooking = customerBooking.customerIndividualBookingList[individualBookingIndex];

    $: if(individualBooking){

        totalServiceCost = 0;
        totalServiceTimeLength = 0;
        individualBooking.customerIndividualServiceBookingList.forEach(booking => {
            totalServiceCost += booking.service.serviceCost;
            totalServiceTimeLength += booking.service.serviceTimeLength;
        });
    }
</script>

<!--List of service booking from the guest-->
<div class="flex flex-col m-1">
    {#key individualBooking.customerIndividualServiceBookingList.length}
        <div class="flex items-center justify-evenly mb-2 p-1 bg-blue-50 border border-blue-200 rounded">
            <span class="flex flex-row text-sm font-medium text-blue-600 whitespace-nowrap"><UserSolid/> Guest #{individualBookingIndex + 1}</span>
            <div class="flex flex-col text-xs text-gray-600 ml-4">
                <span>Services: (<span class="{individualBooking.customerIndividualServiceBookingList.length>0? '':'text-red-600'}">{individualBooking.customerIndividualServiceBookingList.length}</span>)</span>
                <span>Cost: ${totalServiceCost}</span>
                <span>Length: {totalServiceTimeLength} min</span>
            </div>
        </div>

        {#each individualBooking.customerIndividualServiceBookingList as serviceBooking, index (serviceBooking)}
            <ServiceBooking
                    bind:selectedSomething={selectedSomething}
                    bind:individualBooking={individualBooking}
                    serviceBookingIndex={index}
                    bind:serviceBooking={serviceBooking}
            />
        {/each}

        <!-- Section for adding a new service booking -->
        <div class="bg-green-100 border-2 border-dashed border-green-300 p-3 mt-4 rounded text-bold">
            <span class="block text-green-700 mb-2">Add New Service</span>
            <SelectServiceBooking
                    bind:selectedSomething={selectedSomething}
                    newServiceSelect={true}
                    bind:individualBooking={individualBooking}
                    serviceBookingIndex={individualBooking.customerIndividualServiceBookingList.length}
            />
        </div>
    {/key}
</div>
