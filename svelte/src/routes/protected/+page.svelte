<script>
  import { userProfile } from "$lib/page/protected/stores/userProfile.js";
  import { Spinner } from "flowbite-svelte";
  import { onMount } from "svelte";
  import Login from "$lib/page/protected/page_login/Login.svelte";
  import AdminPortal from "$lib/page/protected/business-portal/page_admin/AdminPortal.svelte";
  import BusinessPortalAdmin from "$lib/page/protected/business-portal/page_business_admin/BusinessPortalAdmin.svelte";

  export let data;
  let loading = true;

  // User profile
  $: userProfile.set(data.props);

  onMount(async () => {
    loading = false;

    console.log("userProfile", $userProfile);
  });
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
    <p>BusinessPortalLobby</p>
  {:else if $userProfile.user.role === "EMPLOYEE"}
    <p>BusinessPortalEmployee</p>
  {:else if $userProfile.user.role === "REGISTER"}
    <p>BusinessPortalRegister</p>
  {:else}
    <p>Unexpected user state, please contact support.</p>
  {/if}
</div>
