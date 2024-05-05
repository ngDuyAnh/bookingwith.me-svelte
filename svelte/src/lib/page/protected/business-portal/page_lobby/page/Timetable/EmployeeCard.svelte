<script>

    import {Modal} from "flowbite-svelte";

    export let open;
    export let eventInfo;



</script>


<div style="z-index: 1006;">
    <Modal bind:open={open} size="lg" outsideclose>
        {eventInfo.event.title}
    </Modal>
</div>