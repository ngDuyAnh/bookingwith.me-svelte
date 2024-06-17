<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAm} from "$lib/application/Formatter.js";
    import {
        customerBookingClickModal
    } from "$lib/components/CustomerBookingClickModal/stores/customerBookingClickModal.js";
    import Footer from "$lib/components/CustomerBookingClickModal/components/Footer/Footer.svelte";
</script>

<div class="flex flex-col space-y-4">
    <div class="flex flex-col space-y-2">
        <div>
            <p><strong>Customer name:</strong> {$customerBookingClickModal.customerBooking.customer.customerName}</p>
            <p><strong>Phone number:</strong> {$customerBookingClickModal.customerBooking.customer.phoneNumber}</p>
            <p><strong>Booking
                time:</strong> {dayjs($customerBookingClickModal.customerBooking.bookingTime, formatToTime).format(formatToTimeAm)}
            </p>
            {#if $customerBookingClickModal.customerBooking.message.length !== 0}
                <p class="break-words">
                    <strong>Message:</strong> {$customerBookingClickModal.customerBooking.message}
                </p>
            {/if}
        </div>

        <div>
            <div class="font-bold">Guest(s):</div>
            {#each $customerBookingClickModal.customerBooking.customerIndividualBookingList as individualBooking}
                <div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
                    {#each individualBooking.customerIndividualServiceBookingList as serviceBooking}
                        <div class="mt-1 p-1">
                            <p>{serviceBooking.service.serviceName}
                                ({serviceBooking.employee?.employeeName || 'Any'})</p>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    <!--Footer options-->
    <Footer/>
</div>
