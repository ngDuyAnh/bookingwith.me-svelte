<script>
    import {getLogin} from "$lib/api/api_server/business-portal/api.js";
    import {user} from "$lib/page/protected/stores/user.js";

    let businessId = '';
    let username = '';
    let password = '';

    async function login(event) {
        // Preventing the default form submission behavior
        event.preventDefault();

        // Perform login logic, e.g., fetch user profile from an API
        try {
            const userProfile = await getLogin(businessId, username, password);

            if (typeof window !== 'undefined') {
                sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
            }

            user.set(userProfile);
        } catch (error) {
            alert('Invalid business ID, username, or password.');
            sessionStorage.removeItem('userProfile');
        }
    }
</script>

<div class="form-container">
    <form on:submit|preventDefault={login}>
        <label>
            Business ID
            <input name="businessId" type="text" bind:value={businessId}>
        </label>

        <label>
            Username
            <input name="username" type="text" bind:value={username}>
        </label>

        <label>
            Password
            <input name="password" type="password" bind:value={password}>
        </label>

        <button type="submit">Login</button>
    </form>
</div>

<style>
    /* Styles for the form container */
    .form-container {
        width: 300px; /* Adjust width as needed */
        margin: 0 auto; /* Center the form horizontally */
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
    }

    /* Styles for form labels */
    label {
        display: block;
        margin-bottom: 10px;
    }

    /* Styles for input fields */
    input[type="text"],
    input[type="password"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 3px;
        box-sizing: border-box;
    }

    /* Styles for the submit button */
    button[type="submit"] {
        width: 100%;
        padding: 10px;
        background-color: #007bff; /* Blue color */
        color: #fff; /* White text color */
        border: none;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button[type="submit"]:hover {
        background-color: #0056b3; /* Darker blue color on hover */
    }
</style>
