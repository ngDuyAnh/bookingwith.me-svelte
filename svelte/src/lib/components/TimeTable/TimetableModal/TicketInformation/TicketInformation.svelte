<script>
    import {
        servicingTicketClickModal
    } from "$lib/components/TimeTable/TimetableModal/stores/servicingTicketClickModal.js";
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {CustomerBookingState} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {findPreselectEmployeeID} from "$lib/components/TimeTable/TimetableModal/functions.js";
    import CustomerIndividualServiceBookingComponent
        from "$lib/page/protected/business-portal/page_lobby/page/Dashboard/components/components/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualServiceBookingComponent/CustomerIndividualServiceBookingComponent.svelte";

    export let customerBooking;
    export let individualBooking;
    export let serviceBooking;
    export let isToday;
</script>

<p><strong>Customer name:</strong> {customerBooking.customer.customerName}</p>
<p><strong>Booking time:</strong> {dayjs(customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}
</p>
<p><strong>Number of guest(s):</strong>{customerBooking.customerIndividualBookingList.length}</p>
{#if customerBooking.message.length !== 0}
    <p class="break-words">
        <strong>Message:</strong> {customerBooking.message}
    </p>
{/if}

<div class="mt-1">
    <div class="font-bold">Selected service:</div>

    {#if isToday && customerBooking.bookingState !== CustomerBookingState.COMPLETED}
        <div class="border-2 border-green-400 rounded-md">
            <CustomerIndividualServiceBookingComponent
                    {customerBooking}
                    {serviceBooking}
                    preselectEmployeeID={findPreselectEmployeeID($servicingTicketClickModal.employeeTimetableList, serviceBooking)}
            />
        </div>

        <div class="mt-2">
            {#if individualBooking.customerIndividualServiceBookingList.length > 1}
                <div class="font-bold">Other services for this guest:</div>
                {#each individualBooking.customerIndividualServiceBookingList as individualServiceBooking}
                    {#if serviceBooking.serviceBookingID !== individualServiceBooking.serviceBookingID}
                        <CustomerIndividualServiceBookingComponent
                                {customerBooking}
                                serviceBooking={individualServiceBooking}
                                preselectEmployeeID={findPreselectEmployeeID($servicingTicketClickModal.employeeTimetableList, individualServiceBooking)}
                        />
                    {/if}
                {/each}
            {/if}
        </div>

        <div class="mt-6">
            {#if customerBooking.customerIndividualBookingList.length > 1}
                <div class="font-bold">Other related guest(s) for this booking:</div>
                {#each customerBooking.customerIndividualBookingList as customerIndividualBooking (customerIndividualBooking.individualID)}
                    {#if customerIndividualBooking.individualID !== individualBooking.individualID }
                        <div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
                            {#each customerIndividualBooking.customerIndividualServiceBookingList as individualServiceBooking}
                                <div class="mt-1 p-1">
                                    <CustomerIndividualServiceBookingComponent
                                            {customerBooking}
                                            serviceBooking={individualServiceBooking}
                                            preselectEmployeeID={findPreselectEmployeeID($servicingTicketClickModal.employeeTimetableList, individualServiceBooking)}
                                    />
                                </div>
                            {/each}
                        </div>
                    {/if}
                {/each}
            {/if}
        </div>

    {:else}
        <p>{serviceBooking.service.serviceName}</p>
    {/if}
</div>
