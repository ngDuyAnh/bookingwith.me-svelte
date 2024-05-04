<script>
    export let data;
</script>

<div class="business-info">
    <h1>Business Information</h1>
    <p><span class="label">Business Name:</span> {data.business.businessName}</p>
    <p><span class="label">Business Phone Number:</span> {data.business.businessPhoneNumber}</p>
    <p><span class="label">Contact Phone Number:</span> {data.business.contactPhoneNumber}</p>
    <p><span class="label">Email:</span> {data.business.email}</p>
    <p><span class="label">Owner Name:</span> {data.business.ownerName}</p>
    <p><span class="label">Address:</span> {data.business.address}</p>
    <p><span class="label">City:</span> {data.business.city}</p>
    <p><span class="label">Province:</span> {data.business.province}</p>
    <p><span class="label">Country:</span> {data.business.country}</p>
    <p><span class="label">Postal Code:</span> {data.business.postalCode}</p>
    <p><span class="label">Website URL:</span> <a href={data.business.websiteUrl} target="_blank">{data.business.websiteUrl}</a></p>
    <p><span class="label">Business Type:</span> {data.business.businessType}</p>
    <p><span class="label">Social Media Link:</span> <a href={data.business.socialMediaLink} target="_blank">{data.business.socialMediaLink}</a></p>
    <p><span class="label">Registration Date:</span> {data.business.registrationDate}</p>
    <p><span class="label">Status Flag:</span> {data.business.active ? 'Active' : 'Inactive'}</p>
</div>

<style>
    .business-info {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .business-info h1 {
        color: #333;
        font-size: 24px;
        margin-bottom: 16px;
    }

    .business-info p {
        margin: 4px 0;
        color: #666;
        line-height: 1.6;
    }

    .business-info a {
        color: #0066cc;
        text-decoration: none;
    }

    .business-info a:hover {
        text-decoration: underline;
    }

    .label {
        font-weight: bold;
    }
</style>
