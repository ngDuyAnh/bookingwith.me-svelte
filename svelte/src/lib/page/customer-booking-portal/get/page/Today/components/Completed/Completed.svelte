<script>
    import {bookingEstimate} from "$lib/page/customer-booking-portal/get/stores/bookingEstimate.js";
    import {CustomerBookingReview} from "$lib/api/initialize_functions/CustomerBooking.js";
    import {fly, slide} from "svelte/transition";
    import {CheckCircleSolid, CloseCircleSolid} from "flowbite-svelte-icons";
    import {Spinner, Toast} from "flowbite-svelte";
    import {initializeCustomerBooking} from "$lib/api/api_server/customer-booking-portal/api.js";

    let getReview = !$bookingEstimate.customerBooking.customerBookingReview;
    let review = CustomerBookingReview();

    async function submitReviewToDatabase()
    {
        let customerBooking = {
            ...$bookingEstimate.customerBooking,
            customerBookingReview: review
        };

        // Submit the changes to the backend
        customerBooking = await initializeCustomerBooking(customerBooking);

        bookingEstimate.update(estimate => {
            return {
                ...estimate,
                customerBooking: customerBooking
            };
        });
    }

    let reviewCopyGood = false;
    let reviewCopyBad = false;
    let copyToastTimer;
    let showReviewOptions = false;
    let isLoading = false;
    let errorMessage = "";
    let errorToastTimer;

    function copyToClipboard(text) {
        reviewCopyGood = false;
        reviewCopyBad = false;

        navigator.clipboard.writeText(text).then(() => {
            reviewCopyGood = true;
        }, () => {
            reviewCopyBad = true;
        });
        copyToastTimer = 5;
        timeoutCopyToast();
    }

    function timeoutCopyToast() {
        if (--copyToastTimer > 0) return setTimeout(timeoutCopyToast, 1000);
        reviewCopyGood = false;
        reviewCopyBad = false;
    }

    function showReviewWritingOptions() {
        showReviewOptions = true;
    }

    function isNumeric(str) {
        return /^\d+$/.test(str);
    }

    function removeQuotes(str) {
        return str.replace(/^"|"$/g, '');
    }

    let numPolishReview = 0;
    async function handlePolishReview()
    {
        numPolishReview++;

        isLoading = true;
        errorMessage = "";

        try {
            const response = await fetch('/customer-booking-portal/get/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    businessName: $bookingEstimate.businessName,
                    reviewText: review.reviewText
                })
            });

            const data = await response.json();
            if (response.ok) {
                review.reviewText = removeQuotes(data.polishedReview);
            } else {
                throw new Error(data.error || "Unknown error occurred");
            }

            // Save the review to the database
            await submitReviewToDatabase();
        } catch (error) {
            console.error('Error polishing review:', error);
            errorMessage = error.message || "Failed to polish review. Please try again later.";
            errorToastTimer = 5;
            timeoutErrorToast();
        } finally {
            isLoading = false;
        }

        function timeoutErrorToast() {
            if (--errorToastTimer > 0) return setTimeout(timeoutErrorToast, 1000);
            errorMessage = "";
        }
    }
</script>

<div class="flex items-center justify-center h-screen  bg-gray-100 rounded-lg space-y-4">
    {#if getReview}
        <div class="flex flex-col justify-center items-center p-4 bg-white shadow-lg rounded-lg w-full max-w-lg">
            <div class="text-xl font-semibold mb-4">
                How was your service? Please rate us!
            </div>

            <!-- Get the review stars -->
            <div class="flex mb-4">
                {#each [1, 2, 3, 4, 5] as star}
                    <button disabled={review.rating !==0} on:click={() => review.rating = star}
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
                    <button on:click={() => {
                        submitReviewToDatabase();
                        getReview = false;
                    }}
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
                    <button on:click={() => {
                        submitReviewToDatabase();
                        getReview = false;
                    }}
                            class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        Submit
                    </button>
                </div>
            {:else if review.rating === 5}
                {#if !showReviewOptions}
                    <div class="text-green-500 font-medium mb-2">
                        We're glad you had a great experience! Please consider leaving a review.
                    </div>
                    <button on:click={showReviewWritingOptions}
                            class="bg-blue-500 text-white py-2 px-4 mt-2 rounded-md hover:bg-blue-600">
                        Help me write a review
                    </button>
                    <a href={$bookingEstimate.googleReviewLink} target="_blank"
                       class="bg-green-500 text-white py-2 px-4 mt-2 rounded-md hover:bg-green-600">
                        Take me directly to Google review
                    </a>
                {:else}
                    <div class="text-gray-600 font-medium mb-2">
                        Write about your experience and press <span class="text-purple-500">"Polish Review"</span> to
                        enhance it for Google reviews. <br/>
                        Once finished, select <span class="text-blue-500">"Copy Review"</span> and then click <span
                            class="text-green-500">"Post on Google"</span> to share your review.
                    </div>

                    <Toast bind:open={errorMessage} transition={fly} params={{ y: 50 }} color="red"
                           class="mt-4 w-auto p-4 flex items-center justify-center" divClass="bg-red-300" position="">
                        {errorMessage}
                    </Toast>
                    <textarea disabled={isLoading}
                              id="review-text" bind:value={review.reviewText}
                              required
                              class="border {errorMessage ? 'border-red-600' : 'border-gray-300'} {isLoading ? 'animate-pulse':''} border-gray-300 p-2 mt-2 w-full h-32 rounded-md"
                              placeholder="Your review..."></textarea>

                    <div class="flex mt-2 space-x-2">
                        <button disabled={isLoading || !review.reviewText.trim() || isNumeric(review.reviewText) || numPolishReview > 2}
                                on:click={handlePolishReview}
                                class="text-white py-2 px-4 rounded-md {isLoading || !review.reviewText.trim() || isNumeric(review.reviewText) ? 'bg-purple-500' : 'bg-purple-500 hover:bg-purple-600'}">
                            {#if isLoading}
                                <Spinner/>
                                Polishing...
                            {:else}
                                Polish Review
                            {/if}
                        </button>
                        <button on:click={() => copyToClipboard(review.reviewText)}
                                class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                            Copy Review
                        </button>
                        <a href={$bookingEstimate.googleReviewLink} target="_blank"
                           class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                            Post on Google
                        </a>
                    </div>

                    <Toast
                            color="green"
                            transition={slide}
                            class="mt-4 w-auto p-4 flex items-center justify-center"
                            position="bottom-right"
                            bind:open={reviewCopyGood}
                    >
                        <CheckCircleSolid slot="icon" class="w-5 h-5 "/>
                        Review Copied.
                    </Toast>
                    <Toast color="red" class="mt-4 w-auto p-4 flex items-center justify-center" dismissable={false}
                           position="bottom-right" bind:open={reviewCopyBad}>
                        <CloseCircleSolid slot="icon" class="w-5 h-5"/>
                        Failed to Copy.
                    </Toast>
                {/if}
            {/if}
        </div>
    {:else}
        Thank you!
    {/if}
</div>
