<script>
    import {user} from "$lib/page/protected/stores/user.js";
    import {Spinner} from "flowbite-svelte";
    import {onMount} from "svelte";
    import BusinessPortalAdmin from "$lib/page/protected/business-portal/page_admin/BusinessPortalAdmin.svelte";
    import BusinessPortalLobby from "$lib/page/protected/business-portal/page_lobby/BusinessPortalLobby.svelte";
    import BusinessPortalBusinessAdmin
        from "$lib/page/protected/business-portal/page_business_admin/BusinessPortalBusinessAdmin.svelte";
    import BusinessPortalEmployee
        from "$lib/page/protected/business-portal/page_employee/BusinessPortalEmployee.svelte";
    import BusinessPortalRegister
        from "$lib/page/protected/business-portal/page_register/BusinessPortalRegister.svelte";
    export let data;

    let loading = true;

    onMount(async () => {
        user.set(data);
        loading = false;
        alert(`role is ${$user.role}`);
    });
</script>

<div class="min-h-screen w-full">
    {#if loading}
        <div class="flex justify-center items-center h-screen">
            <Spinner />
        </div>
    {:else if $user.role === 'BUSINESS_ADMIN'}
        <BusinessPortalBusinessAdmin/>
    {:else if $user.role === 'LOBBY'}
        <BusinessPortalLobby/>
    {:else if $user.role === 'ADMIN'}
        <BusinessPortalAdmin/>
    {:else if $user.role === 'EMPLOYEE'}
        <BusinessPortalEmployee/>
    {:else if $user.role === 'REGISTER'}
        <BusinessPortalRegister/>
    {:else}
        <p>Unexpected user state, please contact support.</p>
    {/if}
</div>
