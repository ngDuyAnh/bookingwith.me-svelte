<script>
    import TimeTableComponent from "$lib/components/TimeTable/TimeTableComponent.svelte";
    import {getSchedule} from "$lib/api/api_server/lobby-portal/api.js";
    import {userProfile} from "$lib/page/protected/stores/userProfile.js";

    async function getEmployeeSchedule(businessID, selectedDate, currentTimeString) {
        const response = await getSchedule(
            businessID,
            selectedDate,
            currentTimeString
        );
        const { employeeTimetableList } = response;
        const user = $userProfile.user;

        let timetable = [];

        const conflictedEmployeeTimetable = employeeTimetableList.find(
            timetable => timetable.employee.id === -1
        );

        if (conflictedEmployeeTimetable) {
            timetable.push(conflictedEmployeeTimetable);
        }

        if (user && user.email) {
            const specificEmployeeTimetable = employeeTimetableList.find(
                timetable => timetable.employee.user && timetable.employee.user.email === user.email
            );

            if (specificEmployeeTimetable) {
                timetable.push(specificEmployeeTimetable);
            }
        }

        return timetable;
    }
</script>

<TimeTableComponent
        getSchedule={getEmployeeSchedule}
/>