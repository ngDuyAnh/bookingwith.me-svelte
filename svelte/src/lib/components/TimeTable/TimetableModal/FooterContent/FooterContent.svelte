<!--<script></script>-->
<!--{#if customerBooking.bookingState !== 3 && isToday}-->

<!--    <svelte:fragment slot="footer">-->
<!--        {#if isToday && customerBooking.bookingState !== CustomerBookingState.COMPLETED}-->
<!--            <div class="flex w-full">-->
<!--                <div class="justify-start">-->
<!--                    <Button id="show-tooltip" color="light" outline-->
<!--                            on:click={() => {-->
<!--                                toggleOpen();-->
<!--                                handleEditCustomerBooking($servicingTicketClickModal.customerBooking)-->
<!--                            }}-->
<!--                    >-->
<!--                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"-->
<!--                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"-->
<!--                             viewBox="0 0 24 24">-->
<!--                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"-->
<!--                                  stroke-width="2"-->
<!--                                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>-->
<!--                        </svg>-->
<!--                    </Button>-->
<!--                    <Tooltip triggeredBy="#show-tooltip">Edit Booking</Tooltip>-->
<!--                </div>-->

<!--                <div class="ml-auto justify-end space-x-2">-->
<!--                    <span class="text-gray-700 font-bold">Move to:</span>-->
<!--                    {#if indicateSendToCompleted}-->
<!--                        <button-->
<!--                                class="animate-pulse bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"-->
<!--                                on:click={handleCompletedClick}>Complete-->
<!--                        </button>-->
<!--                    {:else}-->
<!--                        <button-->
<!--                                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"-->
<!--                                on:click={handleCompletedClick}>Complete-->
<!--                        </button>-->
<!--                    {/if}-->
<!--                </div>-->
<!--            </div>-->
<!--        {/if}-->
<!--    </svelte:fragment>-->
<!--{/if}-->