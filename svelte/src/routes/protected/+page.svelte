<script>
    import { userProfile } from "$lib/page/protected/stores/userProfile.js";
    import { Spinner } from "flowbite-svelte";
    import { onMount } from "svelte";
    import Login from "$lib/page/protected/page_login/Login.svelte";
    import AdminPortal from "$lib/page/protected/business-portal/page_admin/AdminPortal.svelte";
    import BusinessPortalAdmin from "$lib/page/protected/business-portal/page_business_admin/BusinessPortalAdmin.svelte";
    import {getBusiness} from "$lib/api/api_server/business-portal/api.js";
    import {business} from "$lib/page/protected/stores/business.js";
    import BusinessPortalLobby from "$lib/page/protected/business-portal/page_lobby/BusinessPortalLobby.svelte";
    import BusinessPortalEmployee from "$lib/page/protected/business-portal/page_employee/BusinessPortalEmployee.svelte";
    import {goto} from "$app/navigation";
    import {employeeSelectOptions} from "$lib/page/stores/EmployeeSelectOptions/employeeSelectOptions_store.js";
    import {
        employeeToSelectOption
    } from "$lib/components/CustomerBooking/CustomerIndividualBookingServiceSelect/components/ServiceOption/ServiceOption.js";

    export let data;
    let loading = true;

    // User profile
    userProfile.set(data.props);

    onMount(async () => {
        //console.log("userProfile", $userProfile)

        // Get the business
        if($userProfile.auth != null &&
            $userProfile.user && $userProfile.user.businessInfo != null)
        {
            const response = await getBusiness($userProfile.user.businessInfo.businessID);
            business.set(response);

            // The business is not active
            // Send to error page
            if (!$business.businessInfo.active)
            {
            await goto('/error');
            }

            // Convert the employee list to selectable options
            if ($business.employeeList && Array.isArray($business.employeeList))
            {
            employeeSelectOptions.set($business.employeeList.map(employeeToSelectOption));
            }
        }

        loading = false;
    });

    //$: console.log("userProfile", $userProfile);
    //$: console.log("business", $business);
</script>

<div class="min-h-screen w-full">
  {#if loading}
    <div class="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  {:else if !$userProfile.auth || !$userProfile.user}
    <Login />
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
