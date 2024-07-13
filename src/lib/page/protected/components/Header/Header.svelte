<script>
    import LogoButton from "$lib/components/assets/Logo/LogoButton.svelte";

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

    export let tabs;
    export let selectedIndex;
    export let dropdown = false;
    export let dropdownOptions;
    export let selectedDropDownIndex;

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

</script>

<header class="z-[60]">
    <div class="corner">
        <LogoButton/>
    </div>

    <div class="hidden lg:block">
        <nav class="">
            <svg  aria-hidden="true" viewBox="0 0 2 3">
                    <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z"/>
            </svg>
            <ul class="px-3">
                {#each tabs as tab, index}
                    <li aria-current={index === selectedIndex ? 'page' : 'not-current-page'}>
                        {#if dropdown && Object.keys(dropdownOptions).includes(tab)}
                            <span class="tab-button">{tab}
                                <ChevronDownOutline
                                        class="w-6 h-6 text-black dark:text-white"/></span>
                            <Dropdown class="p-3 drop rounded-lg">
                                {#each Object.entries(dropdownOptions[tab]) as option, ind}
                                    <DropdownItem
                                            class="whitespace-nowrap tab-button"
                                            on:click={() => {selectTab(index); selectDropDownOption(ind)}}
                                    >{option}</DropdownItem>
                                {/each}
                                <DropdownDivider/>
                            </Dropdown>
                        {:else}
                            <button class="tab-button" on:click={() => selectTab(index)}>
                                {tab}
                            </button>
                        {/if}

                    </li>
                {/each}
            </ul>

            <svg aria-hidden="true" viewBox="0 0 2 3">
                <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z"/>
            </svg>
        </nav>
    </div>

    <div class="corner flex items-center">

        <button aria-label="Show navigation"
                class="lg:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                on:click={() => navigateButtonHidden = false}>
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

                                {#each dropdownOptions[tab] as option, ind}
                                    <SidebarDropdownItem
                                            label={option}
                                            on:click={() => {selectTab(index); selectDropDownOption(ind)}}
                                    >
                                    </SidebarDropdownItem>

<!--                                    <SidebarItem label={option} on:click={() => {selectTab(index); selectDropDownOption(ind)}}-->
<!--                                    >-->
<!--                                        <svelte:fragment slot="icon">-->
<!--                                            {#if tabIcons[option.toLowerCase()]}-->
<!--                                                <svelte:component this={tabIcons[option.toLowerCase()]}-->
<!--                                                                  class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"/>-->
<!--                                            {/if}-->
<!--                                        </svelte:fragment>-->
<!--                                    </SidebarItem>-->
                                {/each}
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
