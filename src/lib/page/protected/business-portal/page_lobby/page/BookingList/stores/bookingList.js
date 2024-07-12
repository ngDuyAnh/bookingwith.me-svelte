import {get, writable} from "svelte/store";
import {getAppointmentBookingList} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
import {tomorrow} from "$lib/page/stores/now/now_dayjs_store.js";
import {
    bookingListCustomerBookingClickModal
} from "$lib/page/protected/business-portal/page_lobby/page/BookingList/components/BookingListCustomerBookingClickModal/stores/BookingListCustomerBookingClickModal.js";

export const bookingList = writable({
    date: tomorrow(),
    customerBookingList: []
});

export function fetchAppointmentCustomerBookingList(businessID, dateString)
{
    // console.log(`fetchAppointmentCustomerBookingList ${businessID} ${dateString}`)

    getAppointmentBookingList(businessID, dateString)
        .then(response => {
            const bookingListCustomerBookingClickModalValue = get(bookingListCustomerBookingClickModal);

            bookingList.set({
                date: dateString,
                customerBookingList: response.customerBookingList
            })

            // Find and reinitialize the customer booking for the modal
            if (bookingListCustomerBookingClickModalValue.customerBooking)
            {
                const findID = bookingListCustomerBookingClickModalValue.customerBooking.id;
                const foundCustomerBooking = findCustomerBookingById(findID);

                console.log("bookingListCustomerBookingClickModalValue", bookingListCustomerBookingClickModalValue)
                console.log("foundCustomerBooking", foundCustomerBooking)


                if (foundCustomerBooking) {
                    bookingListCustomerBookingClickModal.update(current => {
                        return {
                            ...current,
                            customerBooking: foundCustomerBooking
                        };
                    });
                } else {
                    console.log('Customer booking not found for booking list customer booking click modal.');
                    bookingListCustomerBookingClickModal.update(current => {
                        return {
                            ...current,
                            open: false
                        };
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error get appointment booking list:', error);
            bookingList.set({
                date: tomorrow(),
                customerBookingList: []
            })
        });
}

function findCustomerBookingById(id)
{
    const bookingListValue = get(bookingList);
    for (let i = 0; i < bookingListValue.customerBookingList.length; i++)
    {
        if (bookingListValue.customerBookingList[i].id === id) {
            return bookingListValue.customerBookingList[i];
        }
    }
    return null;
}
