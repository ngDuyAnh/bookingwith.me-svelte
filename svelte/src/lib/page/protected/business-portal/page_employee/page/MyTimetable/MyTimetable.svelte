<script>
    import TimeTableComponent from "$lib/components/Timetable/TimeTableComponent.svelte";
    import {
        getEmployeeSchedule
    } from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/MyTimeTable.js";
</script>

<TimeTableComponent
        getSchedule={getEmployeeSchedule}
/>