import {
    encryptData,
    decryptData
} from "./encryption";

const DB_NAME = "HealthcareDashboardDB";
const STORE_NAME = "offlinePatients";
const DB_VERSION = 1;

function openDatabase() {
    return new Promise((resolve, reject) => {

        // Open this database, creating it if necessary.
        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );

        // runs when the database is being created or upgraded.
        request.onupgradeneeded = (event) => {

            const db = event.target.result;

            // event.target is the request. result contains the actual database connection.

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(
                    STORE_NAME,
                    {
                        keyPath: "id",
                        autoIncrement: true
                    }
                );
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


export async function addPatientToIndexedDB(patient) {
    const db = await openDatabase();

    const encryptedData = encryptData(patient);

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.add({
            data: encryptedData
        });

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


export async function getPatientsFromIndexedDB() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readonly"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.getAll();

        request.onsuccess = () => {
            const records = request.result;

            const patients = records.map((record) => {
                const patient = decryptData(
                    record.data
                );

                return {
                    ...patient,
                    id: record.id
                };
            });

            resolve(patients);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}


export async function clearIndexedDB() {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(
            STORE_NAME
        );

        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

export async function removePatientFromIndexedDB(id) {

    const db = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(
            STORE_NAME
        );

        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}