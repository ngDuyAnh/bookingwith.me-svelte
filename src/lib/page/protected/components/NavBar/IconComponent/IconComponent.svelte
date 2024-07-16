<script>
    export let icon = null;
</script>

{#if icon}
    <svelte:component this={icon} class="text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"/>
{/if}