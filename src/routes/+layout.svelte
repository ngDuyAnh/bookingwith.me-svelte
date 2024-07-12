<script>
    import "../app.pcss";
    import './styles.css';

    import customParseFormat from "dayjs/plugin/customParseFormat";
    import dayjs from "dayjs";
    dayjs.extend(customParseFormat);

    function validateFormat(dateString, format) {
        const date = dayjs(dateString, format, true); // true enables strict parsing
        if (!date.isValid()) {
            console.log(`Date string "${dateString}" is invalid for format "${format}"`);
        }

        /*else {
            console.log(`Date string "${dateString}" is valid for format "${format}"`);
        }*/
    }

    import {formatToDate, formatToTime, formatToTimeAM, formatToTimeAm, formatToYearMonth} from "$lib/application/Formatter.js";
    validateFormat("2024-07-02", formatToDate); // Valid date
    validateFormat("14:30", formatToTime); // Valid time
    validateFormat("02:30 pm", formatToTimeAM); // Valid time AM/PM
    validateFormat("2:30 pm", formatToTimeAm); // Valid time AM/PM
    validateFormat("2024-07", formatToYearMonth); // Valid year-month
</script>

<div class="app h-dvh w-full">
    <main>
        <slot/>
    </main>
</div>
