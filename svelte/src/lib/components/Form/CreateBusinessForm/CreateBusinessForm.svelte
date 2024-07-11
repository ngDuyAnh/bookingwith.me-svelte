<script>
    import {createBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";
    import {
        BusinessInformation, BusinessScheduleManagement
    } from "$lib/api/initialize_functions/Business.js";
    import {formatPhoneNumber} from "$lib/application/FormatPhoneNumber.js";
    import {Select} from "flowbite-svelte";

    let business = {
        businessInfo: {
            ...BusinessInformation()
        },

        businessEmail: "",
        lobbyEmail: "",
        contactEmail: "",
        contactName: "",
        contactPhoneNumber: "",
    };

    // let business = {
    //     businessInfo: {
    //         ...TestBusinessInformation()
    //     },
    //
    //     businessEmail: "testBus@gamil.com",
    //     lobbyEmail: "testLob@gamil.com",
    //     contactEmail: "testBus@gamil.com",
    //     contactName: "123423",
    //     contactPhoneNumber: "2222222222",
    // };

    let formattedBusinessPhoneNumber = formatPhoneNumber(business.businessInfo.businessPhoneNumber);
    let formattedContactPhoneNumber = formatPhoneNumber(business.contactPhoneNumber);

    function handleBusinessPhoneNumberInput(event) {
        if (event.target instanceof HTMLInputElement)
        {

            let rawPhoneNumber = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
            rawPhoneNumber = rawPhoneNumber.slice(0, 10); // Limit to 10 digits

            // Update the phone number
            business.businessInfo.businessPhoneNumber = rawPhoneNumber;

            formattedBusinessPhoneNumber = formatPhoneNumber(business.businessInfo.businessPhoneNumber);
        }
    }

    function handleContactPhoneNumberInput(event) {
        if (event.target instanceof HTMLInputElement)
        {
            let rawPhoneNumber = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
            rawPhoneNumber = rawPhoneNumber.slice(0, 10); // Limit to 10 digits

            // Update the phone number
            business.contactPhoneNumber = rawPhoneNumber;

            formattedContactPhoneNumber = formatPhoneNumber(business.contactPhoneNumber);
        }
    }


    function formatOptionName(key) {
        return key.charAt(0) + key.slice(1).toLowerCase();
    }

    let scheduleManagementOptions = Object.entries(BusinessScheduleManagement)
        .filter(([key, value]) => typeof value === 'number') // Ensure only valid options are included
        .map(([key, value]) => ({ value, name: formatOptionName(key) }));

    async function createStripeCustomer(businessEmail,businessName) {

        const response = await fetch('/api/stripe/create-single/customer', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email:businessEmail, name:businessName}),
        });

        return await response.json();
    }

    async function handleSubmit() {
        try {

            const {customerId} = await createStripeCustomer(business.businessEmail,business.businessInfo.businessName)

            business.businessInfo.stripeID = customerId;

            await createBusiness(business);

            // Reset
            business = {
                businessInfo: {
                    ...BusinessInformation()
                },

                businessEmail: "",
                lobbyEmail: "",
                contactEmail: "",
                contactName: "",
                contactPhoneNumber: "",
            };

            // Notify success
            alert("Successfully created the business!");
        } catch (error) {
            console.log(error)
            alert('Failed to create the business!');
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
        <label for="businessName">Business Name:</label>
        <input type="text" id="businessName" bind:value={business.businessInfo.businessName} class="input-field" required>
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
        <input type="email" id="businessEmail" bind:value={business.businessEmail} class="input-field" required>
    </div>
    <div class="form-group">
        <label for="lobbyEmail">Lobby Email:</label>
        <input type="email" id="lobbyEmail" bind:value={business.lobbyEmail} class="input-field" required>
    </div>
    <div class="form-group">
        <label for="contactEmail">Contact Email:</label>
        <input type="email" id="contactEmail" bind:value={business.contactEmail} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="contactName">Contact Name:</label>
        <input type="text" id="contactName" bind:value={business.contactName} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="contactPhoneNumber">Contact Phone Number:</label>
        <input type="tel" id="contactPhoneNumber" bind:value={formattedContactPhoneNumber} on:input={handleContactPhoneNumberInput} required
               pattern="\(\d\d\d\) \d\d\d-\d\d\d\d"
               title="Phone number must be in the format: (123) 456-7890">
    </div>

    <div class="form-group">
        <label for="websiteUrl">Website URL:</label>
        <input type="text" id="websiteUrl" bind:value={business.businessInfo.websiteUrl} class="input-field">
    </div>

    <div class="form-group">
        <label for="businessType">Business Type:</label>
        <input type="text" id="businessType" bind:value={business.businessInfo.businessType} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="socialMediaLink">Social Media Link:</label>
        <input type="text" id="socialMediaLink" bind:value={business.businessInfo.socialMediaLink} class="input-field">
    </div>

    <div class="form-group">
        <label for="googleReviewLink">Google Review Link:</label>
        <input type="text" id="googleReviewLink" bind:value={business.businessInfo.googleReviewLink} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="googleMapsLink">Google Maps Link:</label>
        <input type="text" id="googleMapsLink" bind:value={business.businessInfo.googleMapsLink} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="googleEmbedMapLink">Google Embed Map Link:</label>
        <input type="text" id="googleEmbedMapLink" bind:value={business.businessInfo.googleEmbedMapLink} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="googleMapsDirectionLink">Google Maps Direction Link:</label>
        <input type="text" id="googleMapsDirectionLink" bind:value={business.businessInfo.googleMapsDirectionLink} class="input-field" required>
    </div>

    <div class="form-group">
        <label for="active">Active Flag:</label>
        <input type="checkbox" id="active" bind:checked={business.businessInfo.active} class="input-field">
    </div>

    <div class="form-group">
        <label for="scheduleManagement">Schedule Management Flag:</label>
        <Select items={scheduleManagementOptions} bind:value={business.businessInfo.scheduleManagement} required/>
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
