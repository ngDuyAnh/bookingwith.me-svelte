<script>
    import {getCustomerBookingQueueList, getSchedule} from "$lib/api/api_server/api_endpoints/lobby-portal/api.js";
    import {business} from "$lib/page/stores/business/business.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";
    import {formatToDate, formatToTime} from "$lib/application/Formatter.js";
    import {customerBookingQueueList} from "$lib/page/protected/business-portal/page_lobby/stores/dashboard_store.js";
    import {onMount} from "svelte";
    import {
        Avatar,
        Button,
        Card,
        Chart,
        Modal,
        Popover,
        Spinner,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Toast
    } from "flowbite-svelte";
    import {CashOutline, ChevronRightOutline, InfoCircleSolid, UsersGroupSolid} from 'flowbite-svelte-icons';


    export let selectedDropDownIndex;
    export let selectedIndex;
    export let tabs;
    export let dropdownOptions;

    let todaysProgress = {
        "toDo": 0,
        "inProgress": 0,
        "Done": 0,
    };

    const options = {
        series: [0, 0, 0],
        colors: ['#1C64F2', '#16BDCA', '#FDBA8C'],
        chart: {
            height: '300px',
            width: '100%',
            type: 'radialBar',
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                track: {
                    background: '#E5E7EB'
                },
                dataLabels: {
                    show: false
                },
                hollow: {
                    margin: 0,
                    size: '32%'
                }
            }
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -23,
                bottom: -20
            }
        },
        labels: ['Done', 'In progress', 'To do'],
        legend: {
            show: true,
            position: 'bottom',
            fontFamily: 'Inter, sans-serif'
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
            }
        },
        yaxis: {
            show: false,
            labels: {
                formatter: function (value) {
                    return value + '%';
                }
            }
        }
    };

    let loading = true;
    let totalCompletedEarnings = 0;
    let totalUncompletedEarnings = 0;

    $: console.log("reactive $customerBookingQueueList",$customerBookingQueueList);
    $: {
        if($customerBookingQueueList)
        {
            (async () => {
                await updateDashBoardData();
            })();
        }
    }

    async function fetchCustomerBookingList() {

        // Get the customer booking list
        const response = await getCustomerBookingQueueList($business.businessInfo.businessID, $now.format(formatToDate));
        customerBookingQueueList.set(response.customerBookingQueueList);

        console.log("customerBookingQueueList", $customerBookingQueueList);
        totalCompletedEarnings = calculateCompletedServiceCostEarnings($customerBookingQueueList[3]);
        totalUncompletedEarnings = calculateUnCompletedServiceCostEarnings($customerBookingQueueList);
        console.log("Total Service Cost for Completed Bookings: ", totalCompletedEarnings);
        console.log("Total Service Cost for UnCompleted Bookings: ", totalUncompletedEarnings);

    }

    function calculateUnCompletedServiceCostEarnings(bookingStateList) {
        let totalCost = 0;
        for (let i of [0, 1, 2]) {
            for (let booking of bookingStateList[i]) {
                for (let customerBooking of booking.customerIndividualBookingList) {
                    for (let serviceBooking of customerBooking.customerIndividualServiceBookingList) {
                        totalCost += serviceBooking.service.serviceCost;
                    }
                }
            }
        }
        return totalCost.toFixed(2);
    }

    function calculateCompletedServiceCostEarnings(completedBookings) {
        let totalCost = 0;
        for (let booking of completedBookings) {
            for (let customerBooking of booking.customerIndividualBookingList) {
                for (let serviceBooking of customerBooking.customerIndividualServiceBookingList) {
                    totalCost += serviceBooking.service.serviceCost;
                }
            }
        }
        return totalCost.toFixed(2);
    }

    let totalBookings = 0;
    let employeeOpen = false;
    let countOfWorkingEmployees = 0;

    onMount(async () => {
        loading = true;
        try {
            console.log("$customerBookingQueueList", $customerBookingQueueList);
            await fetchCustomerBookingList().finally(async () => {
                await updateDashBoardData();
            });
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
        }
    });

    async function updateDashBoardData()
    {
        console.log("calling update to dashboard")

        todaysProgress["toDo"] = $customerBookingQueueList[0].length + $customerBookingQueueList[1].length;
        todaysProgress["inProgress"] = $customerBookingQueueList[2].length;
        todaysProgress["Done"] = $customerBookingQueueList[3].length;
        totalBookings = todaysProgress["toDo"] + todaysProgress["inProgress"] + todaysProgress["Done"];
        options.series[2] = ((todaysProgress["toDo"] / totalBookings) * 100).toFixed(2);
        options.series[1] = ((todaysProgress["inProgress"] / totalBookings) * 100).toFixed(2);
        options.series[0] = ((todaysProgress["Done"] / totalBookings) * 100).toFixed(2);

        await fetchSchedule();

        countOfWorkingEmployees = countEmployeesWorkingNow();
    }

    function selectUsageInformation() {
        selectedDropDownIndex = dropdownOptions["Metrics"]["Service"].indexOf("Usage Information");
        selectedIndex = tabs.indexOf("Metrics");

        console.log(selectedDropDownIndex, selectedIndex);
    }

    function selectServicesTab() {
        selectedIndex = tabs.indexOf("Service");

        console.log(selectedDropDownIndex, selectedIndex);
    }

    let employeesWorkingToday = [];

    async function fetchSchedule() {


        try {
            // Get the current time based on if it is today
            let selectedDate = $now.format(formatToDate);
            let currentTimeString = $now.format(formatToTime);

            console.log("selectedDate", selectedDate)

            const {employeeTimetableList} = await getSchedule(
                $business.businessInfo.businessID,
                selectedDate,
                currentTimeString
            );

            employeesWorkingToday = employeeTimetableList;

            console.log("employeeTimetableList", employeeTimetableList);
        } catch (error) {
            console.error("Failed to  fetch tasks", error);
        }

    }

    function countEmployeesWorkingNow() {
        return employeesWorkingToday.reduce((count, employee) => {
            const startTime = $now.hour(parseInt(employee.timePeriod.startTime.split(':')[0])).minute(parseInt(employee.timePeriod.startTime.split(':')[1]));
            const endTime = $now.hour(parseInt(employee.timePeriod.endTime.split(':')[0])).minute(parseInt(employee.timePeriod.endTime.split(':')[1]));

            if (employee.employee.id && $now.isAfter(startTime) && $now.isBefore(endTime)) {
                return count + 1;
            }
            return count;
        }, 0);
    }

</script>

{#if loading}
    <div class="w-full h-full flex justify-center items-center">
        <Spinner/>
    </div>
{:else}
    <h1>Dashboard</h1>
    <div class="w-full h-full flex justify-center items-center">
        <div class="bg-yellow-50 p-3 w-fit md:space-x-4 rounded-lg border-2 space-y-1 h-auto overflow-y-auto flex md:flex-row flex-col md:items-stretch items-center md:justify-evenly justify-center text-green-800">
            <Card>
                <div class="flex justify-between items-start w-full">
                    <div class="flex-col items-center">
                        <div class="flex items-center mb-1">
                            <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Today's
                                Progress</h5>
                            <!--                            <InfoCircleSolid id="donut1"-->
                            <!--                                             class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1"/>-->
                            <!--                            <Popover triggeredBy="#donut1"-->
                            <!--                                     class="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 z-10">-->
                            <!--                                <div class="p-3 space-y-2">-->
                            <!--                                    <h3 class="font-semibold text-gray-900 dark:text-white">Activity growth - -->
                            <!--                                        Incremental</h3>-->
                            <!--                                    <p>Report helps navigate cumulative growth of community activities. Ideally, the-->
                            <!--                                        chart-->
                            <!--                                        should have a growing trend, as stagnating chart signifies a significant-->
                            <!--                                        decrease of-->
                            <!--                                        community activity.</p>-->
                            <!--                                    <h3 class="font-semibold text-gray-900 dark:text-white">Calculation</h3>-->
                            <!--                                    <p>For each date bucket, the all-time volume of activities is calculated. This means-->
                            <!--                                        that-->
                            <!--                                        activities in period n contain all activities up to period n, plus the-->
                            <!--                                        activities-->
                            <!--                                        generated by your community in period.</p>-->
                            <!--                                    <A href="/">Read more-->
                            <!--                                        <ChevronRightOutline class="w-2 h-2 ms-1.5"/>-->
                            <!--                                    </A>-->
                            <!--                                </div>-->
                            <!--                            </Popover>-->
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div class="grid grid-cols-3 gap-3 mb-2">
                        <dl class="bg-orange-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                            <dt class="w-8 h-8 rounded-full bg-orange-100 dark:bg-gray-500 text-orange-600 dark:text-orange-300 text-sm font-medium flex items-center justify-center mb-1">{todaysProgress["toDo"]}</dt>
                            <dd class="text-orange-600 dark:text-orange-300 text-sm font-medium">To do</dd>
                        </dl>
                        <dl class="bg-teal-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                            <dt class="w-8 h-8 rounded-full bg-teal-100 dark:bg-gray-500 text-teal-600 dark:text-teal-300 text-sm font-medium flex items-center justify-center mb-1">{todaysProgress["inProgress"]}
                            </dt>
                            <dd class="text-teal-600 dark:text-teal-300 text-sm font-medium">In progress</dd>
                        </dl>
                        <dl class="bg-blue-50 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center h-[78px]">
                            <dt class="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-500 text-blue-600 dark:text-blue-300 text-sm font-medium flex items-center justify-center mb-1">{todaysProgress["Done"]}</dt>
                            <dd class="text-blue-600 dark:text-blue-300 text-sm font-medium">Done</dd>
                        </dl>
                    </div>
                    <span class="w-full my-2">Total Bookings {totalBookings}</span>
                </div>

                <Chart {options} class="py-6"/>

                <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                    <div class="flex justify-end items-center pt-5">
                        <Button on:click={selectUsageInformation}
                                class="uppercase text-sm font-semibold hover:text-primary-700 dark:hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2 hover:no-underline">
                            Usage Report
                            <ChevronRightOutline class="w-2.5 h-2.5 ms-1.5"/>
                        </Button>
                    </div>
                </div>
            </Card>

            <div class="flex flex-col justify-between space-y-1">
                <Card class="space-y-3 h-fit">
                    <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Employees</h5>

                    <Toast dismissable={false}
                           contentClass="flex space-x-4 rtl:space-x-reverse divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-700 items-center justify-center">
                        <UsersGroupSolid class="w-5 h-5 text-primary-600 dark:text-primary-500"/>
                        <div class="ps-4 text-sm font-normal flex flex-col items-center justify-center"><span
                                class="text-xl font-medium text-primary-600 dark:text-primary-500">{employeesWorkingToday.length>1? employeesWorkingToday.length-1:0}</span>
                            <span class="text-center text-xs">employees on today's schedule.</span>
                        </div>
                        <div class="ps-4 text-sm font-normal flex flex-col items-center"><span
                                class="text-xl font-medium text-primary-600 dark:text-primary-500">{countOfWorkingEmployees}</span>
                            <span class="text-center text-xs">employees at work right now.</span>
                        </div>
                    </Toast>

                    <div class="mt-3 grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between h-fit">
                        <div class="flex justify-end items-center pt-5">
                            <Button on:click={()=>employeeOpen=true}
                                    class="uppercase text-sm font-semibold hover:text-primary-700 dark:hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2 hover:no-underline">
                                View Today's Staff
                                <ChevronRightOutline class="w-2.5 h-2.5 ms-1.5"/>
                            </Button>

                        </div>
                    </div>
                </Card>
                <Card class="space-y-3 h-fit">
                    <div class="flex items-center mb-1">
                        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Today's Service
                            Earnings</h5>
                        <InfoCircleSolid id="donut2"
                                         class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1"/>
                        <Popover triggeredBy="#donut2"
                                 class="text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 z-10">
                            <div class="p-3 space-y-2">
                                <h3 class="font-semibold text-gray-900 dark:text-white">Estimated Calculations</h3>
                                <p>The estimated calculations are based on the service costs listed in the Service tab.
                                    Taxes are not included in these estimates.</p>
                            </div>
                        </Popover>
                    </div>
                    <Toast dismissable={false}
                           contentClass="flex space-x-4 rtl:space-x-reverse divide-x rtl:divide-x-reverse divide-gray-200 dark:divide-gray-700 items-center justify-center">
                        <CashOutline class="w-5 h-5 text-primary-600 dark:text-primary-500"/>
                        <div class="ps-4 text-sm font-normal flex flex-col items-center justify-center"><span
                                class="text-xl font-medium text-green-400">${totalCompletedEarnings}</span>
                            <span class="text-center text-xs">Currently Earned.</span>
                        </div>
                        <div class="ps-4 text-sm font-normal flex flex-col items-center"><span
                                class="text-xl font-medium text-primary-500">+${totalUncompletedEarnings}</span>
                            <span class="text-center text-xs">Potential Earnings</span>
                        </div>
                    </Toast>

                    <div class="mt-3 grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between h-fit">
                        <div class="flex justify-end items-center pt-5">
                            <Button on:click={()=>selectServicesTab()}
                                    class="uppercase text-sm font-semibold hover:text-primary-700 dark:hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2 hover:no-underline">
                                Full Services
                                <ChevronRightOutline class="w-2.5 h-2.5 ms-1.5"/>
                            </Button>

                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
{/if}

<Modal bind:open={employeeOpen}>
    <svelte:fragment slot="header">
        <h1 class="select-none text-2xl text-gray-700 font-bold">
            Employees Working Today
        </h1>
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <div class="ml-auto justify-end content-center">
            <Button on:click={()=>selectedIndex=tabs.indexOf("Employee")}
                    class=" uppercase text-sm font-semibold hover:text-primary-700 dark:hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2 hover:no-underline">
                Edit Employees
                <ChevronRightOutline class="w-2.5 h-2.5 ms-1.5"/>
            </Button>
        </div>
    </svelte:fragment>
    <div class="w-full h-full overflow-y-auto rounded-lg mt-2">
        <Table>
            <TableHead
                    class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <TableHeadCell class="px-1 flex flex-row items-center">
                    <Avatar size="xs"/>
                    Employee
                </TableHeadCell>
                <TableHeadCell class="px-1">Work Hour</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each employeesWorkingToday as employeeInd }
                    {#if employeeInd.employee.id}
                        <TableBodyRow>
                            <TableBodyCell class="px-1"><span>{employeeInd.employee.employeeName}</span>
                            </TableBodyCell>
                            <TableBodyCell class="px-1">{employeeInd.timePeriod.startTime}
                                - {employeeInd.timePeriod.endTime}</TableBodyCell>
                        </TableBodyRow>
                    {/if}
                {/each}
            </TableBody>
        </Table>
    </div>
</Modal>
