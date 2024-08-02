<script>
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";
    import {Spinner} from "flowbite-svelte";
    import Login from "$lib/page/protected/page_login/Login.svelte";
    import AdminPortal from "$lib/page/protected/business-portal/page_admin/AdminPortal.svelte";
    import BusinessPortalAdmin
        from "$lib/page/protected/business-portal/page_business_admin/BusinessPortalAdmin.svelte";
    import {business} from "$lib/page/stores/business/business.js";
    import BusinessPortalLobby from "$lib/page/protected/business-portal/page_lobby/BusinessPortalLobby.svelte";
    import BusinessPortalEmployee
        from "$lib/page/protected/business-portal/page_employee/BusinessPortalEmployee.svelte";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerBookingComponent/components/ServiceOption/functions.js";
    import {employeeSelectOptions} from "$lib/page/stores/employeeSelectOptions/employeeSelectOptions.js";
    import CustomerProfileModal from "$lib/components/Modal/CustomerProfileModal/CustomerProfileModal.svelte";
    import CustomerBookingLobbyModal
        from "$lib/components/Modal/CustomerBookingLobbyModal/CustomerBookingLobbyModal.svelte";
    import CheckOutCustomerBookingModal
        from "$lib/components/Modal/CheckOutCustomerBookingModal/CheckOutCustomerBookingModal.svelte";

    export let data;
    let loading = true;

    // User profile
    userProfile.set(data.userProfile);

    // Business
    business.set(data.business);

    // Convert the employee list to selectable options
    if ($business && $business.employeeList && Array.isArray($business.employeeList)) {
        employeeSelectOptions.set($business.employeeList.map(employeeToSelectOption));
    }

    loading = false;

    //$: console.log("userProfile", $userProfile);
    // $: console.log("business", $business);
</script>

<div class="min-h-screen w-full bg-[#F6F5F2]">
    {#if loading}
        <div class="flex justify-center items-center h-screen">
            <Spinner/>
        </div>
    {:else if !$userProfile.auth || !$userProfile.user}
        <Login/>
    {:else if $userProfile.user.role === "ADMIN"}
        <AdminPortal/>
    {:else if $userProfile.user.role === "BUSINESS_ADMIN"}
        <BusinessPortalAdmin/>
    {:else if $userProfile.user.role === "LOBBY"}
        <BusinessPortalLobby/>
    {:else if $userProfile.user.role === "EMPLOYEE"}
        <BusinessPortalEmployee/>
    {:else if $userProfile.user.role === "REGISTER"}
        <p>Account is not associated to a business.</p>
    {:else}
        <p>Unexpected user state, please contact support.</p>
    {/if}
</div>

<!-- Modal for customer profile -->
<CustomerProfileModal/>

<!-- Modal for create customer booking in lobby -->
<CustomerBookingLobbyModal/>

<!--Modal for checkout customer booking-->
<CheckOutCustomerBookingModal/>
