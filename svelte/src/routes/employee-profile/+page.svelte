<script>
    import Calendar from '@event-calendar/core';
    import ResourceTimeGrid from '@event-calendar/resource-time-grid';
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    let plugins = [ResourceTimeGrid];

    let options = {
        view: 'resourceTimeGridDay',

        allDaySlot: false,
        nowIndicator: true,
        dayMaxEvents: true,
        slotDuration: '00:30:00',
        scrollTime: $now.format('HH:mm:ss'),
        headerToolbar: {
            start: '',
            center: '',
            end: ''
        },
        resources: [],
        events: [],
        eventClick: function (info) {
            openModalServicingTicket(info);
        },
        eventAllUpdated: function () {
            findECBody();
        }
    };

    let events = [];
    let resources = [];
    let loading = true;

</script>

<div class="flex flex-col items-center justify-center w-4/5 h-4/5 mx-auto overflow-x-auto">
    <div class="flex h-full m-auto"
    >
        <Calendar {plugins} {options}/>
    </div>
</div>