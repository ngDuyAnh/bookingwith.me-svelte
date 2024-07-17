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
    import ModalEditCustomerBooking from "$lib/components/Modal/EditCustomerBooking/ModalEditCustomerBooking.svelte";
    import ModalCreateCustomerBooking
        from "$lib/components/Modal/CreateCustomerBooking/ModalCreateCustomerBooking.svelte";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerBookingComponent/components/ServiceOption/functions.js";
    import {employeeSelectOptions} from "$lib/page/stores/employeeSelectOptions/employeeSelectOptions.js";
    import CustomerProfileModal from "$lib/components/Modal/CustomerProfileModal/CustomerProfileModal.svelte";
    import CreateCustomerBookingLobbyModal
        from "$lib/components/Modal/CreateCustomerBookingLobby/CreateCustomerBookingLobbyModal.svelte";
    import EmployeeTimetableModal from "$lib/components/Modal/EmployeeTimetableModal/EmployeeTimetableModal.svelte";

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
    //$: console.log("business", $business);
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

<!-- Create a new customer booking -->
<ModalCreateCustomerBooking
        business={$business}
/>

<!-- Modal for edit customer booking -->
<ModalEditCustomerBooking
        business={$business}
/>

<!-- Modal for customer profile -->
<CustomerProfileModal/>

<!-- Modal for create customer booking in lobby -->
<CreateCustomerBookingLobbyModal/>

<!--Modal for edit employee work schedule exception-->
<div style="z-index: 1006;">
    <EmployeeTimetableModal/>
</div>
