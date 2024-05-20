<script>
    import { Toast } from 'flowbite-svelte';
    import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
    import { Spinner } from 'flowbite-svelte';
    import { fly } from 'svelte/transition';
    import { slide } from 'svelte/transition';

    let rating = 0;
    let reviewText = '';
    let googleReviewLink = 'https://maps.app.goo.gl/rnvNjK4ZFofG1Cic9'; // temp link for now

    function setRating(value) {
        rating = value;
    }

    let reviewCopyGood = false;
    let reviewCopyBad = false;
    let copyToastTimer;
    let showReviewOptions = false;
    let isLoading =false;
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

    async function handlePolishReview() {
        isLoading = true;
        errorMessage = "";
        try {
            const response = await fetch('/customer-booking-portal/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({reviewText})
            });

            const data = await response.json();
            if (response.ok) {
                reviewText = data.polishedReview;
            } else {
                throw new Error(data.error || "Unknown error occurred");
            }
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
            errorMessage="";
        }

    }
</script>

<div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="flex flex-col justify-center items-center p-4 bg-white shadow-lg rounded-lg w-full max-w-lg">
        <div class="text-xl font-semibold mb-4">
            How was your service? Please rate us!
        </div>

        <div class="flex mb-4">
            {#each [1, 2, 3, 4, 5] as star}
                <button disabled={rating !==0} on:click={() => setRating(star)}
                        class="text-3xl focus:outline-none {star <= rating ? 'text-yellow-300' : 'text-gray-300'}">
                    {#if star <= rating}
                        &#9733; <!-- Filled star -->
                    {:else}
                        &#9734; <!-- Empty star -->
                    {/if}
                </button>
            {/each}
        </div>

        {#if rating >= 1 && rating <= 2}
            <div class="text-red-500 font-medium mb-2">
                We're sorry to hear that. How can we improve?
            </div>
            <textarea bind:value={reviewText} class="border border-gray-300 p-2 mt-2 w-full h-32 rounded-md" placeholder="Your feedback..."></textarea>
        {:else if rating >= 3 && rating <= 4}
            <div class="text-yellow-500 font-medium mb-2">
                Thank you! How can we improve?
            </div>
            <textarea bind:value={reviewText} class="border border-gray-300 p-2 mt-2 w-full h-32 rounded-md" placeholder="Your feedback..."></textarea>
        {:else if rating === 5}
            {#if !showReviewOptions}
                <div class="text-green-500 font-medium mb-2">
                    We're glad you had a great experience! Please consider leaving a review.
                </div>
                <button on:click={showReviewWritingOptions} class="bg-blue-500 text-white py-2 px-4 mt-2 rounded-md hover:bg-blue-600">
                    Help me write a review
                </button>
                <a href={googleReviewLink} target="_blank" class="bg-green-500 text-white py-2 px-4 mt-2 rounded-md hover:bg-green-600">
                    Take me directly to Google review
                </a>
            {:else}
                <div class="text-gray-600 font-medium mb-2">
                    Write about your experience and press <span class="text-purple-500">"Polish Review"</span> to enhance it for Google reviews. <br/>
                    Once finished, select <span class="text-blue-500">"Copy Review"</span> and then click <span class="text-green-500">"Post on Google"</span> to share your review.
                </div>

                    <Toast bind:open={errorMessage} transition={fly} params={{ y: 50 }} color="red" class="mt-4 w-auto p-4 flex items-center justify-center" divClass="bg-red-300" position="">
                        {errorMessage}
                    </Toast>
                <textarea id="review-text" bind:value={reviewText} class="border {errorMessage ? 'border-red-600' : 'border-gray-300'} border-gray-300 p-2 mt-2 w-full h-32 rounded-md" placeholder="Your review..."></textarea>
                <div class="flex mt-2 space-x-2">
                    <button disabled={isLoading || !reviewText.trim()} on:click={handlePolishReview} class="text-white py-2 px-4 rounded-md {isLoading || !reviewText.trim() ? 'bg-purple-500' : 'bg-purple-500 hover:bg-purple-600'}">
                        {#if isLoading}
                            <Spinner/>
                            Polishing...
                        {:else}
                            Polish Review
                        {/if}
                    </button>
                    <button on:click={() => copyToClipboard(reviewText)} class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        Copy Review
                    </button>
                    <a href={googleReviewLink} target="_blank" class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
                        Post on Google
                    </a>
                </div>


            {/if}
        {/if}
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
            <Toast  color="red" class="mt-4 w-auto p-4 flex items-center justify-center" dismissable={false} position="bottom-right" bind:open={reviewCopyBad}>
                <CloseCircleSolid slot="icon" class="w-5 h-5"/>
                Failed to Copy.
            </Toast>
    </div>
</div>

<style>
    .flex {
        text-align: center;
    }
    .text-3xl {
        font-size: 2rem; /* Increased star size */
    }
    .shadow-lg {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .rounded-lg {
        border-radius: 0.5rem;
    }
    .rounded-md {
        border-radius: 0.375rem;
    }
    .hover\:bg-blue-600:hover {
        background-color: #2563eb; /* Darker blue on hover */
    }
    .hover\:bg-green-600:hover {
        background-color: #059669; /* Darker green on hover */
    }
    .bg-gray-100 {
        background-color: #f3f4f6;
    }
    .bg-white {
        background-color: #ffffff;
    }
    .max-w-lg {
        max-width: 32rem; /* Ensure the container is reasonably wide */
    }
    .h-32 {
        height: 8rem; /* Increase the height of the text area */
    }
</style>