<script>
    import {CustomerBookingReview} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {initializeCustomerBooking} from "$lib/api/api_server/api_endpoints/customer-booking-portal/api.js";
    import {customerBooking} from "$lib/page/customer-booking-portal/get/stores/customerBookingEstimate.js";
    import {business} from "$lib/page/stores/business/business.js";

    let review = CustomerBookingReview();

    async function submitReviewToDatabase() {
        // Submit the changes to the backend
        let updatedCustomerBooking = await initializeCustomerBooking({
            ...$customerBooking,
            customerBookingReview: review
        });

        // Set the store
        customerBooking.set(updatedCustomerBooking);
    }

    function handleStarClick(star)
    {
        review.rating = star

        // 5 stars
        // Redirect the customer to the Google review page and record to database
        if (review.rating === 5)
        {
            submitReviewToDatabase();
            window.open($business.businessInfo.googleReviewLink, '_blank');
        }
    }
</script>

<div class="flex items-center justify-center h-screen bg-gray-100 rounded-lg space-y-4">
    <div class="flex flex-col justify-center items-center p-4 bg-white shadow-lg rounded-lg w-full max-w-lg">
        {#if !$customerBooking.customerBookingReview}
            <div class="text-xl font-semibold mb-4">
                How was your service? Please rate us!
            </div>

            <!-- Get the review stars -->
            <div class="flex mb-4">
                {#each [1, 2, 3, 4, 5] as star}
                    <button on:click={() => handleStarClick(star)}
                            class="text-3xl focus:outline-none {star <= review.rating ? 'text-yellow-300' : 'text-gray-300'}">
                        {#if star <= review.rating}
                            &#9733; <!-- Filled star -->
                        {:else}
                            &#9734; <!-- Empty star -->
                        {/if}
                    </button>
                {/each}
            </div>

            <!-- Get the review -->
            {#if review.rating >= 1 && review.rating <= 2}
                <div class="text-red-500 font-medium mb-2">
                    We're sorry to hear that. How can we improve?
                </div>
                <textarea bind:value={review.reviewText} class="border border-gray-300 p-2 mt-2 w-full h-32 rounded-md"
                          placeholder="Your feedback..."></textarea>

                <div class="flex mt-2 space-x-2">
                    <button on:click={() => submitReviewToDatabase()}
                            class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        Submit
                    </button>
                </div>
            {:else if review.rating >= 3 && review.rating <= 4}
                <div class="text-yellow-500 font-medium mb-2">
                    Thank you! How can we improve?
                </div>
                <textarea bind:value={review.reviewText}
                          class="border border-gray-300 p-2 mt-2 w-full h-32 rounded-md"
                          required
                          placeholder="Your feedback..."></textarea>

                <div class="flex mt-2 space-x-2">
                    <button on:click={() => submitReviewToDatabase()}
                            class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        Submit
                    </button>
                </div>
            {/if}
        {:else}
            Thank you for taking the time to write the review!
        {/if}
    </div>
</div>
