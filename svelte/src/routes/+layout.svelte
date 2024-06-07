<script>
    import "../app.pcss";
    import './styles.css';

    import customParseFormat from "dayjs/plugin/customParseFormat";
    import dayjs from "dayjs";
    dayjs.extend(customParseFormat);
</script>

<div class="app h-dvh w-full">
    <main>
        <slot/>
    </main>
</div>
