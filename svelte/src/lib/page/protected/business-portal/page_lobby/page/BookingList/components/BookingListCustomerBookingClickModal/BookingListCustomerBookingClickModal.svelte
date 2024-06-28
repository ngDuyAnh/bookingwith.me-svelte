<script>
    import dayjs from "dayjs";
    import {formatToTime, formatToTimeAM} from "$lib/application/Formatter.js";
    import {
        handleLobbyPortalEditCustomerBooking
    } from "$lib/components/Modal/EditCustomerBooking/modalEditCustomerBooking.js";
    import {Button, Modal, Tooltip} from "flowbite-svelte";
    import {
        bookingListCustomerBookingClickModal
    } from "$lib/page/protected/business-portal/page_lobby/page/BookingList/components/BookingListCustomerBookingClickModal/stores/BookingListCustomerBookingClickModal.js";
    import {deleteCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {
        bookingList,
        fetchAppointmentCustomerBookingList
    } from "$lib/page/protected/business-portal/page_lobby/page/BookingList/stores/bookingList.js";

    function handleRemoveBookingClick()
    {
        if (confirm("Are you sure you want to cancel this appointment?"))
        {
            deleteCustomerBooking($business.businessInfo.businessID, $bookingListCustomerBookingClickModal.customerBooking)
                .then(() => {
                    console.log("Deleted customer booking.");

                    // Re-fetch the customer booking list
                    fetchAppointmentCustomerBookingList($business.businessInfo.businessID, $bookingList.date);
                })
                .catch(error => {
                    console.error('Error deleting customer booking:', error);
                });
        }
    }
</script>

<div class="absolute top-0 left-0">
    <Modal bind:open={$bookingListCustomerBookingClickModal.open} size="md" autoclose outsideclose>
        <div>
            <p><strong>Customer name:</strong> {$bookingListCustomerBookingClickModal.customerBooking.customer.customerName}</p>
            <p><strong>Phone number:</strong> {$bookingListCustomerBookingClickModal.customerBooking.customer.phoneNumber}</p>
            <p><strong>Booking
                time:</strong> {dayjs($bookingListCustomerBookingClickModal.customerBooking.bookingTime, formatToTime).format(formatToTimeAM)}</p>
            <p class="break-words"><strong>Message:</strong> {$bookingListCustomerBookingClickModal.customerBooking.message}</p>
            <div class="mt-4">
                <div class="font-bold">Guest(s):</div>
                {#each $bookingListCustomerBookingClickModal.customerBooking.customerIndividualBookingList as individualBooking}
                    <div class="mt-2 p-2 border rounded border-sky-500 bg-gray-50">
                        {#each individualBooking.customerIndividualServiceBookingList as serviceBooking}
                            <div class="mt-1 p-1">
                                <p>{serviceBooking.service.serviceName}
                                    ({serviceBooking.employee?.employeeName || 'Any employee'})</p>
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>

        <div class="mt-4 flex ">
            <div class="justify-start">
                <Button id="show-tooltip" on:click={() => handleLobbyPortalEditCustomerBooking($bookingListCustomerBookingClickModal.customerBooking)}
                        color="light" outline>
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                    </svg>
                </Button>
                <Tooltip triggeredBy="#show-tooltip">Edit Booking</Tooltip>
            </div>

            <div class="ml-auto justify-end items-center space-x-2">
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        on:click={handleRemoveBookingClick}>Remove
                </button>
            </div>
        </div>
    </Modal>
</div>
