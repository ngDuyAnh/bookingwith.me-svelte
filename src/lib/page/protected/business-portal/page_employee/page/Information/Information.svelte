<script>
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";
    import {customerBookingQueueList} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {getEmployeeTips} from "$lib/api/utility_functions/CustomerBooking.js";
    import {findEmployeeFromBusinessUsingEmail} from "$lib/api/utility_functions/Business.js";
    import {business} from "$lib/page/stores/business/business.js";

    // Get the employee
    const employee = findEmployeeFromBusinessUsingEmail(
        $business, $userProfile.user.email
    );

    // Subscribe to the store and update the filtered list reactively
    let customersWithTransactions = [];
    $: {
        customerBookingQueueList.subscribe(list => {
            customersWithTransactions = list.flat().filter(customerBooking => customerBooking.transaction !== null);
        });
    }

    // Calculate the tips
    $: tips = getEmployeeTips(customersWithTransactions, employee);
</script>

<p>Total tips today: ~${tips.toFixed(2)}</p>
