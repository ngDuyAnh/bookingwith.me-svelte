<script>
    import {business} from "$lib/page/stores/business/business.js";
    import {customerBookingQueueList} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {getEmployeeTips} from "$lib/api/utility_functions/CustomerBooking.js";

    // Subscribe to the store and update the filtered list reactively
    let customersWithTransactions = [];
    let employeeTips = [];
    $: {
        customerBookingQueueList.subscribe(list => {
            customersWithTransactions = list.flat().filter(customerBooking => customerBooking.transaction !== null);
        });
    }

    // Calculate tips for all employees and filter those with tips greater than zero
    $: {
        if ($business && $business.employeeList && customersWithTransactions.length > 0) {
            employeeTips = $business.employeeList.map(employee => {
                return {
                    employee,
                    tips: getEmployeeTips(customersWithTransactions, employee)
                };
            }).filter(entry => entry.tips > 0);
        }
    }
</script>

<!-- Display the employees with tips greater than zero -->
{#if employeeTips.length > 0}
    <ul>
        {#each employeeTips as { employee, tips }}
            <li>{employee.employeeName}: ${tips.toFixed(2)}</li>
        {/each}
    </ul>
{:else}
    <p>No tips for any employees today.</p>
{/if}
