<script>
    import TimeTableComponent from "$lib/components/TimeTable/TimeTableComponent.svelte";
    import {getSchedule} from "$lib/api/api_server/lobby-portal/api.js";
    import {business} from "$lib/page/protected/stores/business.js";

    async function getAllEmployeeSchedule( businessID, selectedDate,currentTimeString)
    {
        const response = await getSchedule(
            $business.businessInfo.businessID,
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