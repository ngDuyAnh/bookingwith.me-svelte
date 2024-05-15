<script>
    import {user} from "$lib/page/protected/stores/user.js";
    import BusinessPortalAdmin from "$lib/page/protected/business-portal/page_admin/BusinessPortalAdmin.svelte";
    import {Spinner} from "flowbite-svelte";
    import {onMount} from "svelte";
    import BusinessPortalLobby from "$lib/page/protected/business-portal/page_lobby/BusinessPortalLobby.svelte";
    export let data;

    let loading = true;

    onMount(async () => {
        user.set(data);
        loading = false;
    });
</script>

<div class="min-h-screen w-full">
    {#if loading}
        <div class="flex justify-center items-center h-screen">
            <Spinner />
        </div>
    {:else if $user.role === 'BUSINESS_ADMIN'}
        <BusinessPortalAdmin/>
    {:else if $user.role === 'LOBBY'}
        <BusinessPortalLobby/>
    {:else if $user.role === 'ADMIN'}
        <BusinessPortalLobby/>
    {:else if $user.role === 'EMPLOYEE'}
        <BusinessPortalLobby/>
    {:else if $user.role === 'REGISTER'}
        <BusinessPortalLobby/>
    {:else}
        <p>Unexpected user state, please contact support.</p>
    {/if}
</div>
