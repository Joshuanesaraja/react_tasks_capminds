````md
# Task 017 - Redux Saga Healthcare Dashboard

## Overview

A healthcare dashboard built using React, Redux, and Redux-Saga.

The application demonstrates:

- Pagination performance optimization
- Offline form submission queue
- IndexedDB persistence
- AES encryption for offline data
- API request cancellation using `takeLatest()`
- Patient registration
- Patient details management

## Features

- Fetch patients in batches of 10
- Display 5 patients per page
- Store fetched API patients in Redux
- Fetch additional patient batches only when required
- Submit patients when online
- Queue patients when offline
- Persist the offline queue using IndexedDB
- Encrypt offline patient data using AES
- Restore the offline queue after page refresh
- Automatically process queued patients when the network returns
- Display newly registered patients separately from the paginated patient list
- Cancel previous patient-details requests using `takeLatest()`

## Technologies Used

- React
- Redux
- Redux-Saga
- React-Redux
- JavaScript
- Fetch API
- DummyJSON
- JSONPlaceholder
- IndexedDB
- CryptoJS

## 1. Pagination Performance Optimization

The application fetches patients from the DummyJSON API in batches of 10.

The fetched patients are stored in Redux.

The UI displays 5 patients per page.

### Pagination Flow

```text
API
 ↓
Fetch 10 Patients
 ↓
Redux Store
 ↓
Display 5 Patients Per Page
```
````

For example:

```text
Page 1 → Patients 1–5
Page 2 → Patients 6–10
```

When the user reaches a page that requires another batch, the application fetches the next 10 patients from the API.

The newly fetched patients are added to the existing Redux patient list.

### Batch Pagination

```text
Initial Fetch
 ↓
10 Patients
 ↓
Page 1 → 5 Patients
Page 2 → 5 Patients
 ↓
Next Batch Required
 ↓
Fetch Next 10 Patients
 ↓
Redux
 ↓
Page 3 → 5 Patients
Page 4 → 5 Patients
```

Already fetched batches are tracked using `fetchedBatches` so that the same API batch is not fetched repeatedly.

### Newly Added Patients

Patients created through the registration form are stored separately in:

```text
newlyAddedPatients
```

They are displayed in a separate **Newly Added Patients** section.

This prevents newly registered patients from affecting the API patient pagination.

## 2. Offline Form Submission Queue

The Patient Registration Form contains:

- Patient Name
- Age
- Disease
- Doctor Assigned

### Online Submission

```text
Patient Form
 ↓
SUBMIT_PATIENT_FORM
 ↓
Saga
 ↓
API
 ↓
ADD_NEW_PATIENT
 ↓
newlyAddedPatients
 ↓
UI
```

When the network is available, the patient is submitted directly to the API.

After a successful response, the patient is added to the `newlyAddedPatients` Redux state.

The patient does not affect the paginated API patient list.

### Offline Submission

```text
Patient Form
 ↓
SUBMIT_PATIENT_FORM
 ↓
Saga
 ↓
Network unavailable
 ↓
AES Encryption
 ↓
IndexedDB
 ↓
QUEUE_PATIENT_FORM
 ↓
Redux offlineQueue
```

When the network is unavailable, the patient is encrypted using AES and stored in IndexedDB.

The patient is also added to the Redux `offlineQueue` so that the UI can display the queued patient.

## 3. IndexedDB Persistence

IndexedDB is used to persist offline patient submissions.

### Database Structure

```text
HealthcareDashboardDB
        ↓
offlinePatients
```

The IndexedDB object store uses:

```text
keyPath: "id"
autoIncrement: true
```

Each stored record contains:

```js
{
    id: 1,
    data: "encrypted patient data"
}
```

The patient information itself is stored inside the encrypted `data` field.

### Why IndexedDB?

Redux state is lost when the page is refreshed.

IndexedDB allows the offline queue to survive page refreshes.

```text
Offline Patient
 ↓
IndexedDB
 ↓
Page Refresh
 ↓
Read IndexedDB
 ↓
Restore Redux Queue
```

## 4. AES Encryption

Offline patient data is encrypted before being stored in IndexedDB.

### Encryption Flow

```text
Patient Object
 ↓
encryptData()
 ↓
AES Encrypted String
 ↓
IndexedDB
```

The encrypted data is stored in IndexedDB instead of the original patient information.

### Decryption Flow

```text
IndexedDB
 ↓
Encrypted Data
 ↓
decryptData()
 ↓
Patient Object
 ↓
Redux
```

This allows the application to restore the original patient data after a page refresh.

CryptoJS is used for AES encryption and decryption.

> Note: The AES key used in this training implementation is stored in the frontend application. This demonstrates AES encryption for the task but should not be considered production-grade secret-key management.

## 5. Restoring the Offline Queue

When the application starts, it dispatches:

```text
LOAD_OFFLINE_QUEUE
```

The Saga reads the encrypted records from IndexedDB.

```text
Application Start
 ↓
LOAD_OFFLINE_QUEUE
 ↓
Saga
 ↓
Read IndexedDB
 ↓
Decrypt Patient Data
 ↓
QUEUE_PATIENT_FORM
 ↓
Redux offlineQueue
```

This allows queued patients to remain available after a page refresh.

## 6. Processing the Offline Queue

When the browser comes back online:

```text
NETWORK_ONLINE
 ↓
processOfflineQueueSaga
 ↓
Read IndexedDB
 ↓
Decrypt Patient Data
 ↓
Send Patient to API
 ↓
ADD_NEW_PATIENT
 ↓
Remove Patient from IndexedDB
 ↓
REMOVE_QUEUED_PATIENT
```

Patients are removed from IndexedDB only after the API submission succeeds.

This prevents successfully queued data from being removed before it has been submitted.

## 7. API Request Cancellation

Patient details are loaded through Redux-Saga.

The application uses `takeLatest()` so that when a new patient-details request is made, the previous Saga task is cancelled and the latest request continues.

### Flow

```text
Patient A Selected
 ↓
FETCH_PATIENT_DETAILS
 ↓
Request A Starts
 ↓
Patient B Selected
 ↓
FETCH_PATIENT_DETAILS
 ↓
takeLatest()
 ↓
Previous Saga Task Cancelled
 ↓
Request B Continues
 ↓
Patient B Details Displayed
```

Manual `cancel()` is not used. The cancellation behavior is handled by `takeLatest()`.

## Redux-Saga Architecture

```text
React Component
 ↓
Dispatch Action
 ↓
Redux-Saga Middleware
 ↓
Watcher Saga
 ↓
Worker Saga
 ↓
API / IndexedDB / Queue Logic
 ↓
Reducer
 ↓
Redux Store
 ↓
UI Re-render
```

## Redux-Saga Effects Used

### `call()`

Used to call API and IndexedDB functions.

```js
yield call(fetchPatientsAPI);
```

### `put()`

Used to dispatch Redux actions from Saga.

```js
yield put({
    type: SET_PATIENTS,
    payload: data
});
```

### `takeEvery()`

Runs the worker Saga for every matching action.

```js
yield takeEvery(
    FETCH_PATIENTS,
    fetchPatientsSaga
);
```

### `takeLatest()`

Keeps only the latest Saga task for a matching action.

```js
yield takeLatest(
    FETCH_PATIENT_DETAILS,
    fetchPatientDetailsSaga
);
```

## Redux State

```js
const initialState = {
  patients: [],
  newlyAddedPatients: [],
  offlineQueue: [],
  patientDetails: null,
  status: "Ready",
  networkStatus: navigator.onLine,
  fetchedBatches: [],
};
```

### `patients`

Stores patients retrieved from the API for pagination.

### `newlyAddedPatients`

Stores patients created through the registration form.

These patients are displayed separately from the paginated API patients.

### `offlineQueue`

Stores patients waiting to be submitted after the network becomes available.

### `patientDetails`

Stores the details of the selected patient.

### `status`

Stores the current application status message displayed in the UI.

### `networkStatus`

Stores whether the browser is currently online or offline.

### `fetchedBatches`

Stores the API batch offsets that have already been fetched.

## Redux Actions

```text
FETCH_PATIENTS
SET_PATIENTS
ADD_NEW_PATIENT
SUBMIT_PATIENT_FORM
QUEUE_PATIENT_FORM
FETCH_PATIENT_DETAILS
SET_PATIENT_DETAILS
NETWORK_ONLINE
NETWORK_OFFLINE
REMOVE_QUEUED_PATIENT
SET_STATUS
MARK_BATCH_FETCHED
LOAD_OFFLINE_QUEUE
```

## Project Structure

```text
task017_redux_saga/

│
├── components/
│   ├── PatientList.js
│   ├── PatientForm.js
│   ├── PatientDetails.js
│   └── StatusMessage.js
│
├── redux/
│   ├── actions.js
│   ├── reducer.js
│   ├── saga.js
│   └── store.js
│
├── utils/
│   ├── indexedDB.js
│   └── encryption.js
│
├── Task017.js
├── Task017.css
└── README.md
```

## API Details

### Patient List API

DummyJSON is used to retrieve patient data.

```text
https://dummyjson.com/users
```

The API is requested using `limit` and `skip` parameters for pagination.

Example:

```text
https://dummyjson.com/users?limit=10&skip=0
```

### Patient Details API

Individual patient details are retrieved using the patient ID.

```text
https://dummyjson.com/users/{id}
```

### Patient Registration API

JSONPlaceholder is used as a mock POST API for patient registration.

```text
https://jsonplaceholder.typicode.com/users
```

JSONPlaceholder is a mock API, so POST requests return a simulated response and do not permanently persist the newly created patient on the server.

## Testing

### Pagination

- Fetch patients
- Verify 10 patients are fetched initially
- Verify 5 patients are displayed per page
- Navigate to Page 2
- Verify the next batch is fetched when required
- Verify already fetched batches are not fetched again
- Navigate between pages
- Verify exactly 5 patients are displayed per page
- Verify newly registered patients do not affect pagination

### Online Patient Registration

- Submit a patient while online
- Verify the API request
- Verify the API response
- Verify `ADD_NEW_PATIENT`
- Verify the patient appears under **Newly Added Patients**
- Verify the patient does not change the paginated patient list

### Offline Patient Registration

- Switch the browser network to Offline
- Submit a patient
- Verify `QUEUE_PATIENT_FORM`
- Verify the patient appears in `offlineQueue`
- Verify the patient is stored in IndexedDB
- Verify the IndexedDB record contains encrypted data
- Refresh the page while offline
- Verify the patient is restored from IndexedDB
- Verify the encrypted data is successfully decrypted
- Restore the network connection
- Verify `NETWORK_ONLINE`
- Verify the queued patient is sent to the API
- Verify `ADD_NEW_PATIENT`
- Verify the patient is removed from IndexedDB
- Verify the patient is removed from the Redux offline queue

### Patient Details Cancellation

- Select Patient 1
- Start the details request
- Quickly select Patient 2
- Verify `takeLatest()` handles the latest request
- Verify Patient 2 details are displayed

## Application Flow

### Patient Fetching

```text
PatientList
 ↓
FETCH_PATIENTS
 ↓
Watcher Saga
 ↓
fetchPatientsSaga
 ↓
DummyJSON API
 ↓
SET_PATIENTS
 ↓
Reducer
 ↓
Redux Store
 ↓
PatientList
```

### Online Patient Registration

```text
PatientForm
 ↓
SUBMIT_PATIENT_FORM
 ↓
Saga
 ↓
Online
 ↓
API
 ↓
ADD_NEW_PATIENT
 ↓
newlyAddedPatients
 ↓
UI
```

### Offline Patient Registration

```text
PatientForm
 ↓
SUBMIT_PATIENT_FORM
 ↓
Saga
 ↓
Offline
 ↓
AES Encryption
 ↓
IndexedDB
 ↓
QUEUE_PATIENT_FORM
 ↓
offlineQueue
```

### Offline Queue Restoration

```text
Application Start
 ↓
LOAD_OFFLINE_QUEUE
 ↓
Saga
 ↓
IndexedDB
 ↓
AES Decryption
 ↓
QUEUE_PATIENT_FORM
 ↓
offlineQueue
```

### Offline Queue Processing

```text
NETWORK_ONLINE
 ↓
processOfflineQueueSaga
 ↓
IndexedDB
 ↓
AES Decryption
 ↓
API
 ↓
ADD_NEW_PATIENT
 ↓
Remove from IndexedDB
 ↓
REMOVE_QUEUED_PATIENT
```

### Patient Details

```text
Patient Selection
 ↓
FETCH_PATIENT_DETAILS
 ↓
takeLatest()
 ↓
fetchPatientDetailsSaga
 ↓
DummyJSON API
 ↓
SET_PATIENT_DETAILS
 ↓
Reducer
 ↓
Redux Store
 ↓
PatientDetails
```
