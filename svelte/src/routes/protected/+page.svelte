<script>
    import {initializeUserFromSession, user} from "$lib/page/protected/stores/user.js";
    import BusinessPortalAdmin from "$lib/page/protected/business-portal/page_admin/BusinessPortalAdmin.svelte";
    import Login from "$lib/page/protected/Login/Login.svelte";
    import {Spinner} from "flowbite-svelte";
    import {onMount} from "svelte";
    import BusinessPortalLobby from "$lib/page/protected/business-portal/page_lobby/BusinessPortalLobby.svelte";
    import {page} from "$app/stores";

    let loading = true;

    let businessId = $page.url.searchParams.get('businessId') || '';

    onMount(() => {
        initializeUserFromSession();

        // Done loading data
        loading = false;
    });
</script>

<div class="min-h-screen w-full">
    {#if loading}
        <div class="flex justify-center items-center h-screen">
            <Spinner />
        </div>
    {:else if !$user?.businessId || !$user?.access}
        <Login {businessId}/>
    {:else if $user.access === 'business-portal/admin'}
        <BusinessPortalAdmin/>
    {:else if $user.access === 'business-portal/lobby'}
        <BusinessPortalLobby/>
    {:else}
        <p>Unexpected user state, please contact support.</p>
    {/if}
</div>
