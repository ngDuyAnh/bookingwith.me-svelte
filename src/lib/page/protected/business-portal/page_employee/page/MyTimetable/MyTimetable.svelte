<script>
    import TimetableComponent from "$lib/components/Timetable/TimetableComponent.svelte";
    import {
        getEmployeeSchedule
    } from "$lib/page/protected/business-portal/page_employee/page/MyTimetable/MyTimeTable.js";
</script>

<TimetableComponent
        getSchedule={getEmployeeSchedule}
/>
