<script>
    import LogoButton from "$lib/components/assets/Logo/LogoButton.svelte";
    //import {sineIn} from "svelte/easing";
    import {
        Avatar,
        CloseButton,
        Drawer,
        Dropdown,
        DropdownDivider,
        DropdownHeader,
        DropdownItem,
        Helper,
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        Sidebar,
        SidebarDropdownItem,
        SidebarDropdownWrapper,
        SidebarGroup,
        SidebarItem,
        SidebarWrapper
    } from "flowbite-svelte";
    import {
        ArrowLeftToBracketOutline,
        ArrowRightAltOutline,
        CalendarMonthOutline,
        CalendarMonthSolid,
        CaretDownSolid, CashSolid,
        ChartMixedOutline,
        ChevronDownOutline,
        ClockSolid,
        DollarOutline,
        FlagSolid,
        GridPlusOutline,
        GridPlusSolid,
        GridSolid,
        HomeSolid,
        InfoCircleSolid,
        ListOutline,
        MailBoxSolid,
        PaperPlaneSolid,
        ReceiptOutline,
        StoreSolid,
        UserSettingsOutline,
        UsersGroupSolid
    } from "flowbite-svelte-icons";
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";
    import {onMount} from "svelte";
    import IconComponent from "$lib/page/protected/components/NavBar/IconComponent/IconComponent.svelte";


    export let tabs;
    export let selectedIndex = undefined;
    export let dropdown = false;
    export let dropdownOptions = [];
    export let selectedDropDownIndex = undefined;
    export let landingPage = false;


    let dropdownStates = {};

    onMount(() => {

        if (dropdownOptions) {
            Object.keys(dropdownOptions).forEach(tab => {
                dropdownStates[tab] = false; // Set each tab to false initially
            });
        }
    })

    function selectTab(index) {
        selectedIndex = index;
    }

    function selectDropDownOption(index) {
        selectedDropDownIndex = index;
    }

    function openDropDown(tab) {
        dropdownStates[tab] = true;
    }

    function closeDropDown(tab) {
        dropdownStates[tab] = false;
    }

    // Mapping of tab names to icons
    const tabIcons = {
        "dashboard": GridSolid,
        "timetable": ClockSolid,
        "setting": UserSettingsOutline,
        "future lists": ListOutline,
        "create": GridPlusOutline,
        "my timetable": CalendarMonthOutline,
        "employee": UsersGroupSolid,
        "service": StoreSolid,
        "all timetables": CalendarMonthSolid,
        "report": FlagSolid,
        "metrics": ChartMixedOutline,
        "service spotlight": ArrowRightAltOutline,
        "billing": ReceiptOutline,
        "send review": PaperPlaneSolid,
        "sign in": ArrowLeftToBracketOutline,
        "about": InfoCircleSolid,
        "home": HomeSolid,
        "features": GridPlusSolid,
        "for businesses": StoreSolid,
        "for employees": UsersGroupSolid,
        "pricing": DollarOutline,
        "contact": MailBoxSolid,
        "tips": CashSolid
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

    function toSentenceCase(text) {
        if (!text) return '';
        return text.charAt(0) + text.slice(1).toLowerCase();
    }

    function formatRole(text) {
        if (!text) return '';

        return text.replace(/_/g, ' ')
            .toLowerCase()
            .replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }

    $:console.log("navbar $userProfile", $userProfile);

</script>
<form action="?/logout" class="hidden" id="logout-form" method="post">
    <button type="submit">Logout</button>
</form>

<header class="z-[1000] w-auto">
    <div class="hidden lg:block w-screen ">
        <Navbar class="bg-blue-200">
            <NavBrand href="/">
                <div>
                    <LogoButton/>
                </div>
            </NavBrand>

            {#if !landingPage || landingPage && $userProfile.user}
                <div class="flex justify-end items-center md:order-2">
                    <Avatar id="avatar-menu" src={$userProfile.auth.picture}/>
                </div>
                <Dropdown class="w-fit" placement="bottom-end" triggeredBy="#avatar-menu">
                    <DropdownHeader>
                        <span class="block text-sm">{$userProfile.auth.name}</span>
                        <span class="block truncate text-sm font-semibold">{$userProfile.user.email}</span>
                    </DropdownHeader>
<!--                    <DropdownItem class="text-blue-500" href="/report">Enter {formatRole($userProfile.user.role)}</DropdownItem>-->
                    <DropdownItem class="text-blue-500" href="/protected">Work Area</DropdownItem>
                    <DropdownDivider/>
                    <DropdownItem href="/report">Report</DropdownItem>
                    <DropdownDivider/>
                    <DropdownItem class="text-red-500" on:click={handleLogout}>Sign out</DropdownItem>
                </Dropdown>
            {:else}
                <div class="flex justify-end items-center md:order-2">
                    <Avatar id="avatar-menu"/>
                </div>

                <Dropdown class="w-fit" placement="bottom-end" triggeredBy="#avatar-menu">
                    {#if $userProfile.auth}
                        <DropdownHeader>
                            <span class="block text-sm">{$userProfile.auth.name}</span>
                            <span class="block truncate text-sm font-semibold">{$userProfile.auth.email}</span>
                            <Helper class="text-red-500">Account not associated with bookingwith.me</Helper>
                        </DropdownHeader>
                    {/if}
                    <DropdownItem href="/report">Report</DropdownItem>
                    {#if $userProfile.auth}
                        <DropdownDivider/>
                        <DropdownItem on:click={handleLogout}>Sign out</DropdownItem>
                    {:else}
                        <DropdownItem href="/protected">Already have an account? Sign in</DropdownItem>
                    {/if}
                </Dropdown>

            {/if}

            {#if !landingPage}
                <NavUl>
                    {#each tabs as tab, index}
                        <NavLi>
                            {#if dropdown && Object.keys(dropdownOptions).includes(tab)}
                            <span class="tab-button {index===selectedIndex ? 'text-red-800' : 'text-black'} pt-2 relative flex flex-row items-center">
                                {#if index === selectedIndex}
                                    <CaretDownSolid size="xs"
                                                    class="absolute top-0 left-1/2 transform -translate-x-1/2"/>
                                {/if}
                                <div class="flex flex-row items-center">
                                    <IconComponent icon={tabIcons[tab.toLowerCase()]}/>
                                    {tab}
                                </div>
                                <ChevronDownOutline
                                        class="text-black dark:text-white"/>
                            </span>
                                <Dropdown classContainer="bg-blue-200" class="p-3 drop rounded-lg"
                                          on:click={()=>openDropDown(tab)} bind:open={dropdownStates[tab]}>

                                    {#each Object.keys(dropdownOptions[tab]) as category}

                                        <div class="category">
                                            <strong>{category}</strong>
                                            {#each dropdownOptions[tab][category] as option, i}
                                                <DropdownItem
                                                        class="whitespace-nowrap tab-button"
                                                        on:click={() => {selectTab(index); selectDropDownOption(i); closeDropDown(tab);}}
                                                >
                                                    {option}
                                                </DropdownItem>
                                            {/each}
                                        </div>
                                    {/each}
                                    <DropdownDivider/>
                                </Dropdown>
                            {:else}
                                <button class="tab-button {index===selectedIndex ? 'text-red-800' : 'text-black'} pt-2 relative flex flex-col items-center"
                                        on:click={() => selectTab(index)}>

                                    {#if index === selectedIndex}
                                        <CaretDownSolid size="xs"
                                                        class="absolute top-0 left-1/2 transform -translate-x-1/2"/>
                                    {/if}
                                    <div class="flex flex-row items-center">
                                        <IconComponent icon={tabIcons[tab.toLowerCase()]}/>
                                        {tab}
                                    </div>
                                </button>
                            {/if}

                        </NavLi>
                    {/each}
                </NavUl>
            {:else}
                <NavUl>
                    {#each tabs as tab, index}
                        <NavLi>

                            {#if !$userProfile.auth || $userProfile.auth && tab.toLowerCase() !== "sign in"}
                                <a href={tab.toLowerCase() === "sign in"? '/protected' : '#'+tab.toLowerCase().replaceAll(' ','-')}
                                   class="tab-button {index===selectedIndex ? 'text-red-800' : 'text-black'} pt-2 relative flex flex-col items-center"
                                   on:click={() => selectTab(index)}>

                                    {#if index === selectedIndex}
                                        <CaretDownSolid size="xs"
                                                        class="absolute top-0 left-1/2 transform -translate-x-1/2"/>
                                    {/if}
                                    <div class="flex flex-row items-center">
                                        <IconComponent icon={tabIcons[tab.toLowerCase()]}/>
                                        {tab}
                                    </div>
                                </a>
                            {/if}
                        </NavLi>
                    {/each}
                </NavUl>
            {/if}
        </Navbar>
    </div>

    <div class="lg:hidden corner flex items-end justify-end {landingPage ? 'absolute top-0':''}">

        <button aria-label="Show navigation"
                class="z-[100] lg:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-opacity-50"
                on:click={() => {navigateButtonHidden = false;}}>
            <svg aria-hidden="true" class="z-[1000] w-6 h-6 text-gray-800 dark:text-white" fill="none"
                 height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-linecap="round" stroke-width="2"/>
            </svg>
        </button>
    </div>
</header>

<div class="z-[2000] ">
    <Drawer bind:hidden={navigateButtonHidden} class="z-[2000]" id="sidebar2" {transitionParams} transitionType="fly">
        <div class="flex items-center">
            <LogoButton/>

            <CloseButton class="mb-4 dark:text-white" on:click={() => (navigateButtonHidden = true)}/>
        </div>
        <DropdownDivider/>

        <Sidebar>
            <SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
                <SidebarGroup class="items-start">
                    {#each tabs as tab, index}
                        {#if !landingPage || landingPage && $userProfile.user}
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
                                                        on:click={() => {selectTab(index); selectDropDownOption(i); navigateButtonHidden=true;}}
                                                >
                                                </SidebarDropdownItem>
                                            {/each}
                                        </div>
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
                        {:else}

                            {#if !$userProfile.auth || $userProfile.auth && tab.toLowerCase() !== "sign in"}
                                <SidebarItem label={tab} on:click={() => {
                                    selectTab(index);
                                    navigateButtonHidden = true;
                                }}
                                             href={tab.toLowerCase() === "sign in"? '/protected' : '#'+tab.toLowerCase().replaceAll(' ','-')}
                                >
                                    <svelte:fragment slot="icon">
                                        {#if tabIcons[tab.toLowerCase()]}
                                            <svelte:component this={tabIcons[tab.toLowerCase()]}
                                                              class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"/>
                                        {/if}
                                    </svelte:fragment>
                                </SidebarItem>
                            {/if}
                        {/if}

                    {/each}

                </SidebarGroup>
                <SidebarGroup border>
                    {#if !landingPage || landingPage && $userProfile.user}
                        <SidebarDropdownWrapper label={$userProfile.auth.name}>
                            <svelte:fragment slot="icon">
                                <Avatar id="avatar-menu"
                                        src={$userProfile.auth.picture}/>
                            </svelte:fragment>
                            <span class="block truncate text-sm font-semibold ps-11">{$userProfile.user.email}</span>
                            <SidebarDropdownItem class="text-red-600" href="/report"
                                                 label={"Report"}
                            />
                            <SidebarDropdownItem label={"Sign out"} on:click={handleLogout}/>
                        </SidebarDropdownWrapper>
                    {:else}
                        <SidebarDropdownWrapper label={$userProfile.auth ? $userProfile.auth.name : ''}>
                            <svelte:fragment slot="icon">
                                <Avatar id="avatar-menu" src={$userProfile.auth ? $userProfile.auth.picture : ''}/>
                            </svelte:fragment>
                            {#if $userProfile.auth}
                                <span class="block truncate text-sm font-semibold ps-11">{$userProfile.auth.email}</span>
                                <Helper class="text-red-500 ps-11">Account not associated with bookingwith.me</Helper>
                            {/if}

                            <SidebarDropdownItem class="text-red-600" href="/report"
                                                 label={"Report"}
                            />
                            {#if $userProfile.auth}
                                <SidebarDropdownItem label={"Sign out"} on:click={handleLogout}/>
                            {:else}
                                <SidebarDropdownItem label={"Already have an account? Sign in"} href="/protected"/>
                            {/if}
                        </SidebarDropdownWrapper>
                    {/if}
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

    svg {
        width: 2em;
        height: 3em;
        display: block;
    }

    path {
        fill: var(--background);
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

    :global(.drop) {
        background-color: var(--background);
    }
</style>
