<script>
    import {goto} from '$app/navigation';
    import {createBusiness} from "$lib/api/api_server/business-portal/api.js";
    import {
        BusinessInformation
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions/Business.js";
    import {formatPhoneNumberInput} from "$lib/application/FormatPhoneNumber.js";

    let businessInfo = {
        "business": BusinessInformation(),
        "businessEmail": "bookingwithme.gm@gmail.com",
        "lobbyEmail": "lobbybookingwithme@gmail.com",
        "contactEmail": "bookingwithme_contact@outlook.com",
        "contactName": "Roba",
        "contactPhoneNumber": "0987654321",
    };

    let formattedBusinessPhoneNumber = formatPhoneNumberInput(businessInfo.business.businessPhoneNumber);
    let formattedContactPhoneNumber = formatPhoneNumberInput(businessInfo.contactPhoneNumber);

    function handleBusinessPhoneNumberInput(event) {
        if (event.target instanceof HTMLInputElement)
        {

            let rawPhoneNumber = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
            rawPhoneNumber = rawPhoneNumber.slice(0, 10); // Limit to 10 digits

            // Update the phone number
            businessInfo.business.businessPhoneNumber = rawPhoneNumber;

            formattedBusinessPhoneNumber = formatPhoneNumberInput(businessInfo.business.businessPhoneNumber);
        }
    }

    function handleContactPhoneNumberInput(event) {
        if (event.target instanceof HTMLInputElement)
        {
            let rawPhoneNumber = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
            rawPhoneNumber = rawPhoneNumber.slice(0, 10); // Limit to 10 digits

            // Update the phone number
            businessInfo.contactPhoneNumber = rawPhoneNumber;

            formattedContactPhoneNumber = formatPhoneNumberInput(businessInfo.contactPhoneNumber);
        }
    }

    async function handleSubmit() {
        try {
            const businessResult = await createBusiness(businessInfo);

            // Redirect to the information page with the new created business
            let businessId = businessResult.business.businessId;

            console.log(businessId);

            await goto(`/admin/business/get/${businessId}`);
        } catch (error) {
            console.log(error)
            alert('Failed to create the business!');
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
        <label for="businessName">Business Name:</label>
        <input type="text" id="businessName" bind:value={businessInfo.business.businessName} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="businessPhoneNumber">Business Phone Number:</label>
        <input type="tel" id="businessPhoneNumber" bind:value={formattedBusinessPhoneNumber}
               on:input={handleBusinessPhoneNumberInput} required
               pattern="\(\d\d\d\) \d\d\d-\d\d\d\d"
               title="Phone number must be in the format: (123) 456-7890">
    </div>


    <div class="form-group">
        <label for="businessEmail">Business Email:</label>
        <input type="email" id="email" bind:value={businessInfo.businessEmail} class="input-field" required>
    </div>
    <div class="form-group">
        <label for="lobbyEmail">Lobby Email:</label>
        <input type="email" id="email" bind:value={businessInfo.lobbyEmail} class="input-field" required>
    </div>
    <div class="form-group">
        <label for="contactEmail">Contact Email:</label>
        <input type="email" id="email" bind:value={businessInfo.contactEmail} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="contactName">Contact Name:</label>
        <input type="text" id="contactName" bind:value={businessInfo.contactName} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="contactPhoneNumber">Contact Phone Number:</label>
        <input type="tel" id="contactPhoneNumber" bind:value={formattedContactPhoneNumber} on:input={handleContactPhoneNumberInput} required
               pattern="\(\d\d\d\) \d\d\d-\d\d\d\d"
               title="Phone number must be in the format: (123) 456-7890">
    </div>

    <div class="form-group">
        <label for="address">Address:</label>
        <input type="text" id="address" bind:value={businessInfo.business.address} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="city">City:</label>
        <input type="text" id="city" bind:value={businessInfo.business.city} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="province">Province:</label>
        <input type="text" id="province" bind:value={businessInfo.business.province} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="country">Country:</label>
        <input type="text" id="country" bind:value={businessInfo.business.country} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="postalCode">Postal Code:</label>
        <input type="text" id="postalCode" bind:value={businessInfo.business.postalCode} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="websiteUrl">Website URL:</label>
        <input type="text" id="websiteUrl" bind:value={businessInfo.business.websiteUrl} class="input-field">
    </div>

    <div class="form-group">
        <label for="businessType">Business Type:</label>
        <input type="text" id="businessType" bind:value={businessInfo.business.businessType} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="socialMediaLink">Social Media Link:</label>
        <input type="text" id="socialMediaLink" bind:value={businessInfo.business.socialMediaLink} class="input-field">
    </div>

    <div class="form-group">
        <label for="active">Active Flag:</label>
        <input type="checkbox" id="active" bind:checked={businessInfo.business.active} class="input-field">
    </div>

    <div class="form-group">
        <button type="submit" class="submit-button">Submit</button>
    </div>
</form>

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
