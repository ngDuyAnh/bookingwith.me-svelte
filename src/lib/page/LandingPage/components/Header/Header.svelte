<script>
    import { page } from '$app/stores';
    import LogoButton from "$lib/components/assets/Logo/LogoButton.svelte";
    import report_icon from "$lib/images/report_icon/message-report.png";
    import {
        CloseButton,
        Drawer,
        Sidebar,
        SidebarGroup,
        SidebarItem,
        SidebarWrapper
    } from "flowbite-svelte";
    import { sineIn } from 'svelte/easing';
    import {
                EditOutline,
        InfoCircleSolid, ArrowLeftToBracketOutline
    } from "flowbite-svelte-icons";

    export let tabs = [];

    let navigateButtonHidden = true;
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
</script>

<header class="z-[10]">
    <div class="corner">
        <LogoButton/>
    </div>

    <div class="hidden md:block">
        <nav>
            <svg viewBox="0 0 2 3" aria-hidden="true">
                <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
            </svg>

            <ul>
                {#each tabs as tab}
                    <li aria-current={$page.url === tab.link ? 'page' : 'not-current-page'}>
                        <a href={tab.link}>{tab.name}</a>
                    </li>
                {/each}
            </ul>

            <svg viewBox="0 0 2 3" aria-hidden="true">
                <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
            </svg>
        </nav>
    </div>

    <div class="corner flex items-center">
        <div class="hidden md:block">
            <a href="/report">
                <img src={report_icon}
                     alt="Kid's helpline"
                     title="Kid's helpline"
                />
            </a>
        </div>

        <button class="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                on:click={() => navigateButtonHidden = false} aria-label="Show navigation">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14"/>
            </svg>
        </button>
    </div>
</header>

<Drawer transitionType="fly" {transitionParams} bind:hidden={navigateButtonHidden} id="sidebar2">
    <div class="flex items-center">
        <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
        <CloseButton on:click={() => (navigateButtonHidden = true)} class="mb-4 dark:text-white" />
    </div>
    <Sidebar>
        <SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
            <SidebarGroup>
                <SidebarItem label="Login" href="/protected">
                    <svelte:fragment slot="icon">
                        <ArrowLeftToBracketOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="About" href="/about">
                    <svelte:fragment slot="icon">
                        <InfoCircleSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Report" href="/report">
                    <svelte:fragment slot="icon">
                        <EditOutline class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </svelte:fragment>
                </SidebarItem>
            </SidebarGroup>
        </SidebarWrapper>
    </Sidebar>
</Drawer>

<style>
    header {
        display: flex;
        justify-content: space-between;
    }

    .corner {
        width: 3em;
        height: 3em;
    }

    .corner a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    img {
        width: 2em;
        height: 2em;
    }

    .corner img {
        object-fit: contain;
    }

    nav {
        display: flex;
        justify-content: center;
        --background: rgba(255, 255, 255, 0.7);
    }

    svg {
        width: 2em;
        height: 3em;
        display: block;
    }

    path {
        fill: var(--background);
    }

    ul {
        position: relative;
        padding: 0;
        margin: 0;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        background: var(--background);
        background-size: contain;
    }

    li {
        position: relative;
        height: 100%;
    }

    li[aria-current='page']::before {
        --size: 6px;
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: calc(50% - var(--size));
        border: var(--size) solid transparent;
        border-top: var(--size) solid var(--color-theme-1);
    }

    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 0.5rem;
        color: var(--color-text);
        font-weight: 700;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        transition: color 0.2s linear;
    }

    a:hover {
        color: var(--color-theme-1);
    }
</style>
