import {
    SET_PATIENTS,
    QUEUE_PATIENT_FORM,
    SET_PATIENT_DETAILS,
    REMOVE_QUEUED_PATIENT,
    SET_STATUS,
    NETWORK_ONLINE,
    NETWORK_OFFLINE,
    MARK_BATCH_FETCHED,
    ADD_NEW_PATIENT
} from "./actions";

const initialState = {

    // This will eventually contain the 10 patients fetched from the API.
    patients: [],

    // This is where we'll temporarily keep patient forms when there is no internet connection.
    offlineQueue: [],

    // This will hold the patient currently being viewed.
    patientDetails: null,

    networkStatus: navigator.onLine,

    status: "Ready",

    fetchedBatches: [],

    newlyAddedPatients: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_PATIENTS:
            return {
                ...state,
                patients: [
                    ...state.patients,
                    ...action.payload
                ]
            };

        case QUEUE_PATIENT_FORM:
            return {
                ...state,
                offlineQueue: [...state.offlineQueue, action.payload]
            };

        case SET_PATIENT_DETAILS:
            return {
                ...state,
                patientDetails: action.payload
            };

        // we want to remove the exact patient that was successfully submitted.
        case REMOVE_QUEUED_PATIENT:
            return {
                ...state,
                offlineQueue: state.offlineQueue.filter(
                    (patient) => patient.id !== action.payload
                )
            };

        case NETWORK_ONLINE:
            return {
                ...state,
                networkStatus: true
            };

        case NETWORK_OFFLINE:
            return {
                ...state,
                networkStatus: false
            };

        case SET_STATUS:
            return {
                ...state,
                status: action.payload
            };

        case MARK_BATCH_FETCHED:
            return {
                ...state,
                fetchedBatches: [
                    ...state.fetchedBatches,
                    action.payload
                ]
            };

        case ADD_NEW_PATIENT:
            return {
                ...state,
                newlyAddedPatients: [
                    ...state.newlyAddedPatients,
                    action.payload
                ]
            };

        default:
            return state;
    }
}