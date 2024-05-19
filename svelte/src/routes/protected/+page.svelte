<script>
    import {userProfile} from "$lib/page/protected/stores/userProfile.js";
    import {Spinner} from "flowbite-svelte";
    import {onMount} from "svelte";
    import Login from "$lib/page/protected/page_login/Login.svelte";

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
        <Login/>
    {:else if $userProfile.user.role === 'ADMIN'}
        <p>Admin</p>
    {:else if $userProfile.user.role === 'BUSINESS_ADMIN'}
        <p>BusinessPortalBusinessAdmin</p>
    {:else if $userProfile.user.role === 'LOBBY'}
        <p>BusinessPortalLobby</p>
    {:else if $userProfile.user.role === 'EMPLOYEE'}
        <p>BusinessPortalEmployee</p>
    {:else if $userProfile.user.role === 'REGISTER'}
        <p>BusinessPortalRegister</p>
    {:else}
        <p>Unexpected user state, please contact support.</p>
    {/if}
</div>
