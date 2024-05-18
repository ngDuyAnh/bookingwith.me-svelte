<script>
    import {userProfile} from "$lib/page/protected/stores/userProfile.js";
    import {Spinner} from "flowbite-svelte";
    import {onMount} from "svelte";
    import Login from "$lib/page/protected/page_login/Login.svelte";
    import BusinessPortalAdmin from "$lib/page/protected/business-portal/page_admin/BusinessPortalAdmin.svelte";
    import BusinessPortalLobby from "$lib/page/protected/business-portal/page_lobby/BusinessPortalLobby.svelte";
    import BusinessPortalBusinessAdmin
        from "$lib/page/protected/business-portal/page_business_admin/BusinessPortalBusinessAdmin.svelte";
    import BusinessPortalEmployee
        from "$lib/page/protected/business-portal/page_employee/BusinessPortalEmployee.svelte";
    import BusinessPortalRegister
        from "$lib/page/protected/business-portal/page_register/BusinessPortalRegister.svelte";

    export let data;

    $: userProfile.set(data.props);

    let loading = true;

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
        <Login/>
    {:else if $userProfile.user.role === 'ADMIN'}
        <BusinessPortalAdmin/>
    {:else if $userProfile.user.role === 'BUSINESS_ADMIN'}
        <BusinessPortalBusinessAdmin/>
    {:else if $userProfile.user.role === 'LOBBY'}
        <BusinessPortalLobby/>
    {:else if $userProfile.user.role === 'EMPLOYEE'}
        <BusinessPortalEmployee/>
    {:else if $userProfile.user.role === 'REGISTER'}
        <BusinessPortalRegister/>
    {:else}
        <p>Unexpected user state, please contact support.</p>
    {/if}
</div>
