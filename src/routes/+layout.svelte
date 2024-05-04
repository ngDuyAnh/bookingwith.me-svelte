<script>
    import "../app.pcss";
    import './styles.css';

    import customParseFormat from "dayjs/plugin/customParseFormat";
    import dayjs from "dayjs";
    dayjs.extend(customParseFormat);
</script>

<div class="app w-full min-h-screen">
    <main>
        <slot/>
    </main>
</div>
