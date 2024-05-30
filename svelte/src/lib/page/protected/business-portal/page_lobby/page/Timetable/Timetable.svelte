<script>
    import {getSchedule} from "$lib/api/api_server/lobby-portal/api.js";
    import TimeTableComponent from "$lib/components/Timetable/TimeTableComponent.svelte";

    async function getAllEmployeeSchedule(businessID, selectedDate, currentTimeString)
    {
        const response = await getSchedule(
            businessID,
            selectedDate,
            currentTimeString
        );
        const {employeeTimetableList} = response;

        return employeeTimetableList;
    }
</script>

<TimeTableComponent
    getSchedule={getAllEmployeeSchedule}
/>
