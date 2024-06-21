<script>
    import LogoButton from "$lib/components/assets/Logo/LogoButton.svelte";
    //import {sineIn} from "svelte/easing";
    import {
        CloseButton,
        Drawer,
        Dropdown, DropdownDivider,
        DropdownItem,
        Sidebar, SidebarDropdownItem, SidebarDropdownWrapper,
        SidebarGroup,
        SidebarItem,
        SidebarWrapper
    } from "flowbite-svelte";
    import {
        ArrowRightAltOutline,
        CalendarMonthOutline,
        CalendarMonthSolid,
        ChevronDownOutline,
        ChevronRightOutline,
        ClockSolid,
        FlagSolid,
        GridPlusOutline,
        GridSolid,
        ListOutline,
        StoreSolid,
        UserSettingsOutline,
        UsersGroupSolid,
        ReceiptOutline
    } from "flowbite-svelte-icons";

    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, DropdownHeader } from 'flowbite-svelte';
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";


    export let tabs;
    export let selectedIndex;
    export let dropdown = false;
    export let dropdownOptions;
    export let selectedDropDownIndex;

    $: console.log("userProfile",$userProfile);
    function selectTab(index) {
        selectedIndex = index;
    }

    function selectDropDownOption(index) {
        selectedDropDownIndex = index;
    }

    // Mapping of tab names to icons
    const tabIcons = {
        "dashboard": GridSolid,
        "timetable": ClockSolid,
        "setting": UserSettingsOutline,
        "list": ListOutline,
        "create": GridPlusOutline,
        "my timetable": CalendarMonthOutline,
        "employee": UsersGroupSolid,
        "service": StoreSolid,
        "all timetables": CalendarMonthSolid,
        "report": FlagSolid,
        "upcoming service": ArrowRightAltOutline,
        "billing": ReceiptOutline
    };

    let navigateButtonHidden = true;
    let transitionParams = {
        x: -320,
        duration: 200,
        //easing: sineIn
    };

    function handleLogout() {
        document.getElementById('logout-form').submit();
    }

    let activeClass = 'text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-500';

</script>
<form id="logout-form" class="hidden" method="post" action="?/logout">
    <button type="submit">Logout</button>
</form>

<header class="z-[60] w-auto">
    <div class="hidden lg:block w-screen ">
        <Navbar class="bg-blue-200">
            <NavBrand href="/">
                <div class="corner">
                    <LogoButton/>
                </div>
            </NavBrand>
            <div class="flex justify-end items-center md:order-2">
                <Avatar id="avatar-menu" src="https://lh3.googleusercontent.com/a/ACg8ocJFx8mxt8DHyqdk8kbTOse7cdcgvEnFG1hlS7WNyO8NQVy82A=s96-c" />
                <NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
            </div>
            <Dropdown placement="bottom-end" triggeredBy="#avatar-menu" class="w-fit">
                <DropdownHeader>
                    <span class="block text-sm">{$userProfile.auth.name}</span>
                    <span class="block truncate text-sm font-semibold">{$userProfile.user.email}</span>
                </DropdownHeader>
                <DropdownItem href="/report">Report</DropdownItem>
                <DropdownDivider />
                <DropdownItem on:click={handleLogout}>Sign out</DropdownItem>
            </Dropdown>


            <NavUl>
            {#each tabs as tab, index}
                <NavLi aria-current={index === selectedIndex ? 'page' : 'not-current-page'}>
                    {#if dropdown && Object.keys(dropdownOptions).includes(tab)}
                            <span class="tab-button">{tab}
                                <ChevronDownOutline
                                        class="w-6 h-6 text-black dark:text-white"/></span>
                        <Dropdown classContainer="bg-blue-200" class="p-3 drop rounded-lg">

                            {#each Object.keys(dropdownOptions[tab]) as category, ind}

                                <div class="category">
                                    <strong>{category}</strong>
                                    {#each dropdownOptions[tab][category] as option, i}
                                        <DropdownItem
                                                class="whitespace-nowrap tab-button"
                                                on:click={() => {selectTab(index); selectDropDownOption(i);}}
                                        >
                                            {option}
                                        </DropdownItem>
                                    {/each}
                                </div>
                                <!--{#each dropdownOptions[tab][head] as option}-->
                                <!--    <DropdownItem-->
                                <!--            class="whitespace-nowrap tab-button"-->
                                <!--            on:click={() => {selectTab(index); selectDropDownOption(ind)}}-->
                                <!--    >{option}</DropdownItem>-->
                                <!--{/each}-->

                            {/each}
                            <DropdownDivider/>
                        </Dropdown>
                    {:else}
                        <button class="tab-button" on:click={() => selectTab(index)}>
                            {tab}
                        </button>
                    {/if}

                </NavLi>
            {/each}
            </NavUl>
        </Navbar>
    </div>

    <div class="lg:hidden corner flex items-end justify-end">

        <button aria-label="Show navigation"
                class="lg:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                on:click={() => {navigateButtonHidden = false; console.log("???")}}>
            <svg aria-hidden="true" class="w-6 h-6 text-gray-800 dark:text-white" fill="none"
                 height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
            </svg>
        </button>
    </div>
</header>

<div class="z-[10000]">
    <Drawer bind:hidden={navigateButtonHidden} id="sidebar2" {transitionParams} transitionType="fly">
        <div class="flex items-center">
            <h5 class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
                id="drawer-navigation-label-3">
                Menu</h5>
            <CloseButton class="mb-4 dark:text-white" on:click={() => (navigateButtonHidden = true)}/>
        </div>
        <Sidebar>
            <SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
                <SidebarGroup class="items-start">
                    {#each tabs as tab, index}
                        {#if dropdown && Object.keys(dropdownOptions).includes(tab)}
                            <SidebarDropdownWrapper label={tab}>
                                <svelte:fragment slot="icon">
                                    {#if tabIcons[tab.toLowerCase()]}
                                        <svelte:component this={tabIcons[tab.toLowerCase()]}
                                                          class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"/>
                                    {/if}
                                </svelte:fragment>

                                {#each Object.keys(dropdownOptions[tab]) as category}

                                    <div class="category">
                                        <strong class="ps-5">{category}</strong>
                                        {#each dropdownOptions[tab][category] as option, i}
                                            <SidebarDropdownItem
                                                    label={option}
                                                    on:click={() => {selectTab(index); selectDropDownOption(i);}}
                                            >
                                            </SidebarDropdownItem>
                                        {/each}
                                    </div>
                                {/each}

                            <!--    {#each dropdownOptions[tab] as option, ind}-->
                            <!--        <SidebarDropdownItem-->
                            <!--                label={option}-->
                            <!--                on:click={() => {selectTab(index); selectDropDownOption(ind)}}-->
                            <!--        >-->
                            <!--        </SidebarDropdownItem>-->

                            <!--        &lt;!&ndash;                                    <SidebarItem label={option} on:click={() => {selectTab(index); selectDropDownOption(ind)}}&ndash;&gt;-->
                            <!--        &lt;!&ndash;                                    >&ndash;&gt;-->
                            <!--        &lt;!&ndash;                                        <svelte:fragment slot="icon">&ndash;&gt;-->
                            <!--        &lt;!&ndash;                                            {#if tabIcons[option.toLowerCase()]}&ndash;&gt;-->
                            <!--        &lt;!&ndash;                                                <svelte:component this={tabIcons[option.toLowerCase()]}&ndash;&gt;-->
                            <!--        &lt;!&ndash;                                                                  class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"/>&ndash;&gt;-->
                            <!--        &lt;!&ndash;                                            {/if}&ndash;&gt;-->
                            <!--        &lt;!&ndash;                                        </svelte:fragment>&ndash;&gt;-->
                            <!--        &lt;!&ndash;                                    </SidebarItem>&ndash;&gt;-->
                            <!--    {/each}-->
                            </SidebarDropdownWrapper>
                        {:else}
                            <SidebarItem label={tab} on:click={() => {
                        selectTab(index);
                        navigateButtonHidden = true;
                    }}
                            >
                                <svelte:fragment slot="icon">
                                    {#if tabIcons[tab.toLowerCase()]}
                                        <svelte:component this={tabIcons[tab.toLowerCase()]}
                                                          class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"/>
                                    {/if}
                                </svelte:fragment>
                            </SidebarItem>
                        {/if}


                    {/each}

                </SidebarGroup>
            </SidebarWrapper>
        </Sidebar>
    </Drawer>
</div>
<style>
    header {
        display: flex;
        justify-content: space-between;
    }

    .corner {
        width: 3em;
        height: 3em;
    }

    nav {
        display: flex;
        justify-content: center;
        --background: rgba(119, 110, 110, 0.7);
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
        padding: 3px;
        border-width: 3px;
        border-radius: 1rem;
        border-color:transparent;
    }

    li:hover {
        /*background-color: rgba(var(--background-rgb), 0.5);;*/
        /*background: white;*/
        background-color: rgba(calc(var(--background-r)*0.1),calc(var(--background-g)*0.1),calc(var(--background-b)*0.1), 1);
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

    nav .tab-button {
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

    .tab-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .tab-button:hover {
        color: var(--color-theme-1);
    }

    :global(.tab-button:hover) {
        color: var(--color-theme-1);
    }

    :global(.drop){
        background-color: var(--background);
    }
</style>
