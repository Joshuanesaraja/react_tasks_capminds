import {
    call,
    put,
    takeEvery,
    takeLatest
} from "redux-saga/effects";

import {
    addPatientToIndexedDB,
    getPatientsFromIndexedDB,
    removePatientFromIndexedDB
} from "../utils/indexedDB";

import {
    FETCH_PATIENTS,
    SET_PATIENTS,
    SUBMIT_PATIENT_FORM,
    QUEUE_PATIENT_FORM,
    FETCH_PATIENT_DETAILS,
    SET_PATIENT_DETAILS,
    NETWORK_ONLINE,
    ADD_NEW_PATIENT,
    REMOVE_QUEUED_PATIENT,
    SET_STATUS,
    MARK_BATCH_FETCHED,
    LOAD_OFFLINE_QUEUE
} from "./actions";

// Creating our API function for fetch, submit, JSONPlaceholder as the mock API
function fetchPatientsAPI(skip) {
    return fetch(
        `https://dummyjson.com/users?limit=10&skip=${skip}`
    ).then((res) => res.json());
}

// submitPatientAPI(patient) -> It can accept your POST request and return a response that looks like a successfully created resource,
// but the data isn't actually persisted in a database.

function submitPatientAPI(patient) {
    return fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(patient)
        }
    ).then((res) => res.json());
}

function fetchPatientDetailsAPI(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            fetch(
                `https://dummyjson.com/users/${id}`
            )
                .then((res) => res.json())
                .then((data) => resolve(data));
        }, 2000);
    });
}

// Worker Saga for fetching patients
function* fetchPatientsSaga(action) {
    try {
        const data = yield call(
            fetchPatientsAPI,
            action.payload
        );

        console.log("Patients fetched:", data);

        yield put({
            type: SET_PATIENTS,
            payload: data.users
            // We only want the actual users for our Redux patients array, because this mock api gets users,total, skip etc
        });

        yield put({
            type: MARK_BATCH_FETCHED,
            payload: action.payload
        });

        yield put({
            type: SET_STATUS,
            payload: "Patients fetched successfully"
        });
    } catch (error) {
        console.error(
            "Failed to fetch patients:",
            error
        );

        yield put({
            type: SET_STATUS,
            payload: "Failed to fetch patients"
        });
    }
}

// Worker Saga for submitting a patient
function* submitPatientSaga(action) {

    if (navigator.onLine) {
        try {
            const data = yield call(
                submitPatientAPI,
                action.payload
            );

            console.log("Patient added:", data);

            yield put({
                type: ADD_NEW_PATIENT,
                payload: {
                    ...action.payload,
                    id: data.id
                }
            });

            yield put({
                type: SET_STATUS,
                payload: "Patient added successfully"
            });

        } catch (error) {

            console.error(
                "Failed to add patient:",
                error
            );

            yield put({
                type: SET_STATUS,
                payload: "Failed to add patient"
            });
        }

    } else {

        try {

            const id = yield call(
                addPatientToIndexedDB,
                action.payload
            );

            const queuedPatient = {
                ...action.payload,
                id: id
            };

            console.log(
                "Patient added to IndexedDB:",
                queuedPatient
            );

            yield put({
                type: QUEUE_PATIENT_FORM,
                payload: queuedPatient
            });

            yield put({
                type: SET_STATUS,
                payload: "Patient added to offline queue"
            });

        } catch (error) {

            console.error(
                "Failed to save patient to IndexedDB:",
                error
            );

            yield put({
                type: SET_STATUS,
                payload: "Failed to save patient offline"
            });
        }
    }
}

// Worker Saga for loading offline patients from IndexedDB
function* loadOfflineQueueSaga() {
    try {

        // This reads the persistent browser storage.
        const patients = yield call(
            getPatientsFromIndexedDB
        );

        console.log(
            "Offline patients loaded from IndexedDB:",
            patients
        );

        // puts each stored patient back into Redux.
        for (const patient of patients) {

            yield put({
                type: QUEUE_PATIENT_FORM,
                payload: patient
            });
        }

        if (patients.length > 0) {
            yield put({
                type: SET_STATUS,
                payload: "Offline queue restored"
            });
        }

    } catch (error) {

        console.error(
            "Failed to load offline queue:",
            error
        );

        yield put({
            type: SET_STATUS,
            payload: "Failed to restore offline queue"
        });
    }
}

// Worker Saga for processing offline queue
function* processOfflineQueueSaga() {

    try {

        const queue = yield call(
            getPatientsFromIndexedDB
        );

        console.log(
            "Offline queue from IndexedDB:",
            queue
        );

        if (queue.length === 0) {

            console.log(
                "No patients in offline queue"
            );

            yield put({
                type: SET_STATUS,
                payload: "No patients in offline queue"
            });

            return;
        }

        console.log(
            "Processing offline queue..."
        );

        yield put({
            type: SET_STATUS,
            payload: "Online: Processing offline queue"
        });

        for (const patient of queue) {

            try {

                const data = yield call(
                    submitPatientAPI,
                    patient
                );

                yield put({
                    type: ADD_NEW_PATIENT,
                    payload: {
                        ...patient,
                        id: data.id
                    }
                });

                console.log(
                    "Offline patient submitted:",
                    data
                );

                yield call(
                    removePatientFromIndexedDB,
                    patient.id
                );

                console.log(
                    "Patient removed from IndexedDB:",
                    patient.id
                );

                yield put({
                    type: REMOVE_QUEUED_PATIENT,
                    payload: patient.id
                });

                yield put({
                    type: SET_STATUS,
                    payload: "Offline patient submitted successfully"
                });

            } catch (error) {

                console.error(
                    "Failed to submit offline patient:",
                    error
                );

                yield put({
                    type: SET_STATUS,
                    payload: "Failed to submit offline patient"
                });
            }
        }

    } catch (error) {

        console.error(
            "Failed to process offline queue:",
            error
        );

        yield put({
            type: SET_STATUS,
            payload: "Failed to process offline queue"
        });
    }
}

// Worker Saga for fetching patient details
function* fetchPatientDetailsSaga(action) {
    try {

        console.log(
            `Fetching Patient ${action.payload}...`
        );

        yield put({
            type: SET_STATUS,
            payload: `Fetching Patient ${action.payload}...`
        });

        const data = yield call(
            fetchPatientDetailsAPI,
            action.payload
        );

        console.log("Patient details:", data);

        yield put({
            type: SET_PATIENT_DETAILS,
            payload: data
        });

        yield put({
            type: SET_STATUS,
            payload: `Patient ${action.payload} details loaded`
        });
    } catch (error) {
        console.error(
            "Failed to fetch patient details:",
            error
        );

        yield put({
            type: SET_STATUS,
            payload: "Failed to fetch patient details"
        });
    }
}

// rootSaga contains the watcher Sagas.
// Watcher Saga -> Whenever an action is dispatched,
// the corresponding Worker Saga runs.

export default function* rootSaga() {

    yield takeEvery(
        FETCH_PATIENTS,
        fetchPatientsSaga
    );

    yield takeEvery(
        SUBMIT_PATIENT_FORM,
        submitPatientSaga
    );

    yield takeEvery(
        NETWORK_ONLINE,
        processOfflineQueueSaga
    );

    yield takeEvery(
        LOAD_OFFLINE_QUEUE,
        loadOfflineQueueSaga
    );

    yield takeLatest(
        FETCH_PATIENT_DETAILS,
        fetchPatientDetailsSaga
    );
}