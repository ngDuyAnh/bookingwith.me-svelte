import {get, writable} from 'svelte/store';
import {business} from "$lib/page/stores/business/business.js";
import {BusinessScheduleManagement} from "$lib/api/initialize_functions/Business.js";

export const modalEditCustomerBooking = writable({
    open: false,
    customerBooking: undefined,

    // Customer individual booking select service
    customerIndividualBookingServiceSelectProps: {
        showAllServiceGroup: true,
        showAllService: true,
        showAllEmployeeSelectOptions: true
    },

    // Option header
    customerBookingInformationProps: {
        showOverride: true,
        showSendSms: true,
        showAppointmentBookingState: true,
        showLobbyBookingState: false,

        overrideFlag: false,
        sendSMSFlag: false,
        appointmentBookingStateFlag: false,
        lobbyBookingStateFlag: false
    },

    // Customer information form
    customerBookingInformationFormProps: {
        customerNameAutoComplete: true,
        requiredAgreeToReceiveSms: false
    }
});

export function handleLobbyPortalEditCustomerBooking(customerBooking)
{
    const currentBusiness = get(business);
    const scheduleManagement = currentBusiness.businessInfo.scheduleManagement;
    const overrideFlagState = scheduleManagement === BusinessScheduleManagement.NONE;

    modalEditCustomerBooking.set({
        open: true,
        customerBooking: JSON.parse(JSON.stringify(customerBooking)),

        // Customer individual booking select service
        customerIndividualBookingServiceSelectProps: {
            showAllServiceGroup: true,
            showAllService: true,
            showAllEmployeeSelectOptions: true
        },

        // Option header
        customerBookingInformationProps: {
            showOverride: true,
            showSendSms: true,
            showAppointmentBookingState: true,
            showLobbyBookingState: false,

            overrideFlag: overrideFlagState,
            sendSMSFlag: false,
            appointmentBookingStateFlag: false,
            lobbyBookingStateFlag: false
        },

        // Customer information form
        customerBookingInformationFormProps: {
            customerNameAutoComplete: true,
            requiredAgreeToReceiveSms: false
        }
    });
}

export function handleCustomerBookingPortalEditCustomerBooking(customerBooking)
{
    modalEditCustomerBooking.set({
        open: true,
        customerBooking: JSON.parse(JSON.stringify(customerBooking)),

        // Customer individual booking select service
        customerIndividualBookingServiceSelectProps: {
            showAllServiceGroup: false,
            showAllService: false,
            showAllEmployeeSelectOptions: false
        },

        // Option header
        customerBookingInformationProps: {
            showOverride: false,
            showSendSms: false,
            showAppointmentBookingState: false,
            showLobbyBookingState: false,

            overrideFlag: false,
            sendSMSFlag: false,
            appointmentBookingStateFlag: false,
            lobbyBookingStateFlag: false
        },

        // Customer information form
        customerBookingInformationFormProps: {
            customerNameAutoComplete: false,
            requiredAgreeToReceiveSms: false
        }
    });
}
