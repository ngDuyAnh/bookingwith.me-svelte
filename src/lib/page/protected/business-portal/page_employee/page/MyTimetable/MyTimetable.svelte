<script>
    import TimetableComponent from "$lib/components/Timetable/TimetableComponent.svelte";
    import {userProfile} from "$lib/page/stores/userProfile/userProfile.js";
</script>

<TimetableComponent
        bind:user={$userProfile.user}
        ableToChangeEmployeeWorkSchedule={false}
/>
