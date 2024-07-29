<script>
    import "../app.pcss";
    import './styles.css';

    import customParseFormat from "dayjs/plugin/customParseFormat";
    import utc from "dayjs/plugin/utc";
    import timezone from "dayjs/plugin/timezone"
    import dayjs from "dayjs";

    // Customer parse format
    dayjs.extend(customParseFormat);

    // Coordinated Universal Time
    // Enables converting local time to UTC
    dayjs.extend(utc);

    // Working with different time zones
    dayjs.extend(timezone);

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

    // Get the local timezone
    const localTimeZone = dayjs.tz.guess();
    console.log("Your local timezone is:", localTimeZone);
</script>

<div class="app h-dvh w-full">
    <main>
        <slot/>
    </main>
</div>
