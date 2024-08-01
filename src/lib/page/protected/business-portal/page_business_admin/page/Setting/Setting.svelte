<script>
    import {business} from "$lib/page/stores/business/business.js";
    import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import {PUBLIC_ORIGIN} from "$env/static/public";
    import {Spinner} from "flowbite-svelte";

    let loading = false;
    let businessValue = JSON.parse(JSON.stringify($business));

    async function handleSubmit()
    {
        loading = true;
        await initializeBusiness(businessValue);
        loading = false;
    }

    $: console.log("businessValue", businessValue);
</script>


{#if loading}
    <div class="flex justify-center items-center h-screen">
        <Spinner/>
    </div>
{:else}
    <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
            <label for="onlineBookingLink">Online booking link:</label>
            <a id="onlineBookingLink" href={`${PUBLIC_ORIGIN}/customer-booking-portal/create/${$business.businessInfo.businessID}`} target="_blank">Link</a>
        </div>

        <div class="form-group">
            <label for="googleReviewLink">Google Review Link:</label>
            <input type="text" id="googleReviewLink" bind:value={businessValue.businessInfo.googleReviewLink} class="input-field" required>
        </div>

        <div class="form-group">
            <label for="googleMapsLink">Google Maps Link:</label>
            <input type="text" id="googleMapsLink" bind:value={businessValue.businessInfo.googleMapsLink} class="input-field" required>
        </div>

        <div class="form-group">
            <label for="googleEmbedMapLink">Google Embed Map Link:</label>
            <input type="text" id="googleEmbedMapLink" bind:value={businessValue.businessInfo.googleEmbedMapLink} class="input-field" required>
        </div>

        <div class="form-group">
            <label for="googleMapsDirectionLink">Google Maps Direction Link:</label>
            <input type="text" id="googleMapsDirectionLink" bind:value={businessValue.businessInfo.googleMapsDirectionLink} class="input-field" required>
        </div>

        <div class="form-group">
            <label for="active">Active Flag:</label>
            <input type="checkbox" id="active" bind:checked={businessValue.businessInfo.active} class="input-field">
        </div>

        <div class="form-group">
            <button type="submit" class="submit-button">Submit</button>
        </div>
    </form>
{/if}

<style>
    input, button {
        width: 100%;
        padding: 1rem;
        margin-bottom: 1rem;
        border: 1px solid #e5e7eb; /* A light grey color */
        border-radius: 0.5rem;
        font-size: 1rem;
        background-color: #f0f0f0; /* Light grey background for better contrast */
        color: #333; /* Darker text for better visibility */
    }

    button {
        background-color: #4CAF50;
        color: #fff;
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button:hover {
        background-color: #66BB6A;
    }
</style>
