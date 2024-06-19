import {getSchedule} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";

export async function getEmployeeSchedule(businessID, selectedDate, currentTimeString) {
    let currentUser = null;
    const unsubscribe = userProfile.subscribe(profile => {
        currentUser = profile.user
    });

    const response = await getSchedule(
        businessID,
        selectedDate,
        currentTimeString
    );
    const {employeeTimetableList} = response;

    unsubscribe();

    let timetable = [];

    if (currentUser && currentUser.email) {
        const specificEmployeeTimetable = employeeTimetableList.find(
            timetable => timetable.employee.user && timetable.employee.user.email === currentUser.email
        );

        if (specificEmployeeTimetable) {
            timetable.push(specificEmployeeTimetable);
        }
    }

    return timetable;
}