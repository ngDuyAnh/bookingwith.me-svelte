<script>
    import Logo from "./Logo.svelte";

    export let props = "";
    export let buttonAction = () => {
        document.body.scrollIntoView();
    };
</script>

<button class="variant-filled-secondary
            relative
            px-5 py-2
            rounded-full bg-transparent
            font-medium transition-colors ease-in-out
            focus:outline-none
            vibrate"
        on:click={buttonAction}
>
    <Logo props="p-2 bg-white rounded-full {props}"/>
</button>

<style>
    @keyframes vibrate {
        0%, 100% {
            transform: translate(0);
        }
        25% {
            transform: translate(-1px, 1px);
        }
        50% {
            transform: translate(-1px, -1px);
        }
        75% {
            transform: translate(1px, 1px);
        }
    }

    .vibrate:hover {
        animation: vibrate 1s linear infinite;
    }
</style>
