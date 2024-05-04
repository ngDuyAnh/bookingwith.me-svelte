import Dexie from 'dexie';

const db = new Dexie('contact');
const archive_db = new Dexie('archive_contact');

// Declare table
db.version(1).stores({
    contacts: '++id, timestamp, name, email, phoneNumber, message'
});
archive_db.version(1).stores({
    archive_contacts: '++id, timestamp, name, email, phoneNumber, message'
});

/*async function resetDatabase(db) {
    const tableNames = db.tables.map(table => table.name);
    await Promise.all(tableNames.map(name => db.table(name).clear()));
    console.log('Database has been reset.');
}

async function initializeDatabases() {
    try {
        // Reset the given database

        //await resetDatabase(db);

        db.delete().then(() => {
            console.log("Database successfully deleted");
        }).catch((err) => {
            console.error("Failed to delete database:", err);
        })

        archive_db.delete().then(() => {
            console.log("Archive database successfully deleted");
        }).catch((err) => {
            console.error("Failed to delete archive database:", err);
        })

        console.log('Databases initialized.');
    } catch (error) {
        console.error('Error initializing databases:', error);
    }
}
initializeDatabases().then(r =>  console.log('Databases initialized.'));*/

export { db, archive_db };
