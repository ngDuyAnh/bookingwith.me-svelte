<script>
    import { onMount } from 'svelte';
    import {db, archive_db} from '$lib/svelte_server/contact_database/database.js';
    import {formatTimestamp} from '$lib/svelte_server/contact_database/formatTimestamp.js'
    import {writable} from "svelte/store";

    // Keep track of the current number of contacts
    let currentContactCount = 9999999999;

    function playSound() {
        const sound = new Audio('/assets/level_up_sound/level-up-191997.mp3');
        sound.play().catch(error => console.error('Error playing sound:', error));
    }

    const contacts = writable([]);

    async function refreshContactsList() {
        const updatedContacts = await db.contacts.toArray();

        // Check if there are more contacts now than before
        if (updatedContacts.length > currentContactCount) {
            playSound(); // New contact added, play sound
        }

        // Update the current count and the contacts store
        currentContactCount = updatedContacts.length;
        contacts.set(updatedContacts);
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

    async function handleArchive(contactId) {
        // Get the contact to archive
        const contact = await db.contacts.get(contactId);
        if (contact) {
            // Add to the archive
            await archive_db.archive_contacts.add(contact);
            // Remove from the current contacts
            await db.contacts.delete(contactId);

            // Reinitialize the list immediately
            refreshContactsList();
        }
    }
</script>

<div class="contact-count">Total Contacts: {$contacts.length}</div>
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
            <button on:click={() => handleArchive(contact.id)} class="archive-button">Archive</button>
        </li>
    {/each}
</ul>

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

    .date, .contact-info, .archive-button {
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

    .archive-button {
        justify-self: end; /* Align the button to the end of its grid area */
        background-color: #f3f3f3;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        color: black;
    }

    .archive-button:hover {
        background-color: #e1e1e1;
    }
</style>
