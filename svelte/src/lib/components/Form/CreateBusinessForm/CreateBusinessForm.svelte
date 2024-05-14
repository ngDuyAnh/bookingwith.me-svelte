<script>
    import { goto } from '$app/navigation';
    import {createBusiness} from "$lib/api/api_server/business-portal/api.js";
    import {
        BusinessInformation
    } from "$lib/api/api_server/customer-booking-portal/utility-functions/initialize_functions/Business.js";
    import {now} from "$lib/page/stores/now/now_dayjs_store.js";

    let business = BusinessInformation($now);

    function handleBusinessPhoneNumberInput(event) {
        if (event.target instanceof HTMLInputElement)
        {
            const input = event.target;
            let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
            value = value.slice(0, 10); // Limit to 10 digits

            // Format as "(123) 456-7890"
            if (value.length > 6) {
                // If more than 6 digits, format with parenthesis and dash
                business.businessPhoneNumber = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length > 3) {
                // If more than 3 digits, include parenthesis
                business.businessPhoneNumber = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length > 0) {
                // If 1-3 digits, just wrap in parentheses
                business.businessPhoneNumber = `(${value}`;
            } else {
                // Empty input
                business.businessPhoneNumber = '';
            }

            // Update the input's display and the bound variable
            event.target.value = business.businessPhoneNumber;
        }
    }

    function handleContactPhoneNumberInput(event) {
        if (event.target instanceof HTMLInputElement)
        {
            const input = event.target;
            let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
            value = value.slice(0, 10); // Limit to 10 digits

            // Format as "(123) 456-7890"
            if (value.length > 6) {
                // If more than 6 digits, format with parenthesis and dash
                business.contactPhoneNumber = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length > 3) {
                // If more than 3 digits, include parenthesis
                business.contactPhoneNumber = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length > 0) {
                // If 1-3 digits, just wrap in parentheses
                business.contactPhoneNumber = `(${value}`;
            } else {
                // Empty input
                business.contactPhoneNumber = '';
            }

            // Update the input's display and the bound variable
            event.target.value = business.contactPhoneNumber;
        }
    }

    async function handleSubmit() {
        try
        {
            const businessResult = await createBusiness(business, accessString);

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
        <input type="text" id="businessName" bind:value={business.businessName} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="businessPhoneNumber">Business Phone Number:</label>
        <input type="tel" id="businessPhoneNumber" bind:value={business.businessPhoneNumber} on:input={handleBusinessPhoneNumberInput} required
               pattern="\(\d\d\d\) \d\d\d-\d\d\d\d"
               title="Phone number must be in the format: (123) 456-7890">
    </div>

    <div class="form-group">
        <label for="contactPhoneNumber">Contact Phone Number:</label>
        <input type="tel" id="contactPhoneNumber" bind:value={business.contactPhoneNumber} on:input={handleContactPhoneNumberInput} required
               pattern="\(\d\d\d\) \d\d\d-\d\d\d\d"
               title="Phone number must be in the format: (123) 456-7890">
    </div>

    <div class="form-group">
        <label for="businessEmail">Business Email:</label>
        <input type="email" id="email" bind:value={business.businessEmail} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="ownerName">Owner Name:</label>
        <input type="text" id="ownerName" bind:value={business.ownerName} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="address">Address:</label>
        <input type="text" id="address" bind:value={business.address} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="city">City:</label>
        <input type="text" id="city" bind:value={business.city} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="province">Province:</label>
        <input type="text" id="province" bind:value={business.province} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="country">Country:</label>
        <input type="text" id="country" bind:value={business.country} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="postalCode">Postal Code:</label>
        <input type="text" id="postalCode" bind:value={business.postalCode} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="websiteUrl">Website URL:</label>
        <input type="text" id="websiteUrl" bind:value={business.websiteUrl} class="input-field">
    </div>

    <div class="form-group">
        <label for="businessType">Business Type:</label>
        <input type="text" id="businessType" bind:value={business.businessType} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="socialMediaLink">Social Media Link:</label>
        <input type="text" id="socialMediaLink" bind:value={business.socialMediaLink} class="input-field">
    </div>


    <div class="form-group">
        <label for="registrationDate">Registration Date:</label>
        <input type="date" id="registrationDate" bind:value={business.registrationDate} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="active">Active Flag:</label>
        <input type="checkbox" id="active" bind:checked={business.active} class="input-field">
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
