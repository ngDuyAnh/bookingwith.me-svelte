<script>
    import { onMount } from 'svelte';
    import {archive_db} from "$lib/svelte_server/contact_database/database.js";
    import {formatTimestamp} from '$lib/svelte_server/contact_database/formatTimestamp.js'
    import {writable} from "svelte/store"; // Ensure this path is correct

    async function downloadFormattedJson(data, filename = 'archive-database-export.json') {
        // Ensure 'data' is the actual data you want to serialize and download
        const contacts = await archive_db.archive_contacts.toArray();
        const formattedJson = JSON.stringify(contacts, null, 2); // Format the JSON
        const blob = new Blob([formattedJson], { type: 'application/json;charset=utf-8;' });
        const href = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = href;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(href);
    }

    const contacts = writable([]);

    async function refreshContactsList() {
        const updatedContacts = await archive_db.archive_contacts.toArray();
        contacts.set(updatedContacts); // Update the Svelte store with fresh data
    }

    onMount(async () => {
        refreshContactsList();

        // Set up polling every 10 seconds to reload data
        const intervalId = setInterval(() => {
            refreshContactsList(); // Use the new function here as well
        }, 10000);

        return () => {
            clearInterval(intervalId); // Clear interval when component is destroyed
        };
    });

    async function deleteContact(contactId) {
        if (confirm("Are you sure you want to delete this contact?")) {
            await archive_db.archive_contacts.delete(contactId);
            refreshContactsList(); // Refresh the list to reflect the changes
        }
    }
</script>

<div>
    <button on:click={downloadFormattedJson}>Download Archive Database</button>

    <ul class="contact-list">
        {#each $contacts as contact}
            <li class="grid-item">
                <div class="date" title={contact.timestamp}>{formatTimestamp(contact.timestamp)}</div>
                <div class="contact-info">
                    <strong>{contact.name}</strong><br>
                    {contact.email}<br>
                    {contact.phoneNumber}
                </div>
                <div class="message">{contact.message}</div>
                <button on:click={() => deleteContact(contact.id)} class="delete-button">Delete</button>
            </li>
        {/each}
    </ul>
</div>

<style>
    .contact-list {
        list-style-type: none;
        padding: 0;
    }

    .grid-item {
        display: grid;
        grid-template-columns: 2fr 3fr 3fr 1fr; /* Adjust the proportions as needed */
        align-items: center;
        gap: 10px; /* Space between grid items */
        margin-bottom: 1rem;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .date, .contact-info, .delete-button  {
        padding: 0.5rem;
    }

    .message {
        padding: 0.5rem;
        overflow-wrap: break-word; /* Allows the text to wrap and prevents overflow */
        /* If you still encounter issues, consider using these additional properties */
        overflow: hidden; /* Hides any content that overflows the box */
        text-overflow: ellipsis; /* Adds an ellipsis to indicate hidden text */
        white-space: normal; /* Ensures text wraps and doesn't stay on one line */
        max-height: 100%; /* Optionally limit the height of the message area */
    }

    .delete-button {
        justify-self: end; /* Align the button to the end of its grid area */
        background-color: #ff0000;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        color: black;
    }

    .delete-button:hover {
        background-color: #e1e1e1;
    }
</style>
