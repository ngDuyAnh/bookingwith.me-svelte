<script>
    import Select from 'svelte-select';

    import {business} from "$lib/page/stores/business/business.js";

    $: serviceSelectOptions = $business.serviceGroupList.flatMap(group =>
        group.serviceList.map(service => ({
            group: group.serviceGroupName,
            label: service.serviceName,
            value: service.id,
    })));
</script>

<Select items={serviceSelectOptions} groupBy={(item) => item.group}/>
