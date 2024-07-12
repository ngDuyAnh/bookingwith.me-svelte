<script>
    export let textarea_placeholder = "Share some information about yourself, business, ideas, inquiries, what you are looking for or expecting. I'd love to chat.";

    let name = '';
    let email = '';
    let phoneNumber = '';
    let message = '';

    function handlePhoneNumberInput(event) {
        if (event.target instanceof HTMLInputElement)
        {
            const input = event.target;
            let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
            value = value.slice(0, 10); // Limit to 10 digits

            // Format as "(123) 456-7890"
            if (value.length > 6) {
                // If more than 6 digits, format with parenthesis and dash
                phoneNumber = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            } else if (value.length > 3) {
                // If more than 3 digits, include parenthesis
                phoneNumber = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length > 0) {
                // If 1-3 digits, just wrap in parentheses
                phoneNumber = `(${value}`;
            } else {
                // Empty input
                phoneNumber = '';
            }

            // Update the input's display and the bound variable
            event.target.value = phoneNumber;
        }
    }
</script>

<form action="https://api.staticforms.xyz/submit" method="post">

    <input type="hidden" name="accessKey" value="42845fe9-34eb-4e01-b2f7-fc9650997037">

    <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" bind:value={name} class="input-field" name="name" required>
    </div>

    <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" bind:value={email} class="input-field" name="email" required>
    </div>

    <div class="form-group">
        <label for="phoneNumber">Phone Number:</label>
        <input type="tel" id="phoneNumber" bind:value={phoneNumber} on:input={handlePhoneNumberInput} name="phone" required
               pattern="\(\d\d\d\) \d\d\d-\d\d\d\d"
               title="Phone number must be in the format: (123) 456-7890">
    </div>

    <div class="form-group">
        <label for="message">Message:</label>
        <textarea id="message" bind:value={message} class="input-field" rows="5" name="message" required
                  placeholder={textarea_placeholder}/>
    </div>

    <div class="form-group">
        <input type="submit" value="Submit" class="submit-button"/>
    </div>
</form>

<style>
    input, textarea {
        width: 100%;
        padding: 1rem;
        margin-bottom: 1rem;
        border: 1px solid #e5e7eb; /* A light grey color */
        border-radius: 0.5rem;
        font-size: 1rem;
        background-color: #f0f0f0; /* Light grey background for better contrast */
        color: #333; /* Darker text for better visibility */
    }

    textarea {
        resize: vertical;
    }

    .submit-button {
        background-color: #4CAF50;
        color: #fff;
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
