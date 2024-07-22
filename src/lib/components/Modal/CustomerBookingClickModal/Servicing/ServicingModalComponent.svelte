<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {
        customerBookingClickModal
    } from "$lib/components/Modal/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import CustomerIndividualBookingComponent
        from "$lib/components/Modal/CustomerBookingClickModal/Servicing/components/CustomerIndivdualBookingComponent/CustomerIndividualBookingComponent.svelte";
    import PhoneNumber from "$lib/components/Modal/CustomerBookingClickModal/components/PhoneNumber/PhoneNumber.svelte";
</script>

<div class="flex flex-col space-y-4">
    <div class="flex flex-col space-y-2">
        <div>
            <p><strong>Customer name:</strong> {$customerBookingClickModal.customerBooking.customer.customerName} ({($customerBookingClickModal.customerBooking.id % 1000).toString().padStart(3, '0')})</p>
            <PhoneNumber/>
            <p><strong>Booking
                time:</strong> {dayjs($customerBookingClickModal.customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}
            </p>
            <p><strong>Check-in
                time:</strong> {dayjs($customerBookingClickModal.customerBooking.checkinTime, formatToTime).format(formatToTimeAm)}
            </p>
            <p><strong>Start
                time:</strong> {dayjs($customerBookingClickModal.customerBooking.servicingStartTime, formatToTime).format(formatToTimeAm)}
            </p>
            {#if $customerBookingClickModal.customerBooking.message.length !== 0}
                <p class="break-words">
                    <strong>Message:</strong> {$customerBookingClickModal.customerBooking.message}
                </p>
            {/if}
        </div>

        <div class="mt-4">
            <div class="font-bold">Guest(s):</div>
            {#each $customerBookingClickModal.customerBooking.customerIndividualBookingList as individualBooking (individualBooking.individualID)}
                <CustomerIndividualBookingComponent
                        customerBooking={$customerBookingClickModal.customerBooking}
                        {individualBooking}
                />
            {/each}
        </div>
    </div>
</div>
