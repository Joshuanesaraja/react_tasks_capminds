import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    FETCH_PATIENTS,
    FETCH_PATIENT_DETAILS
} from "../redux/actions";

function PatientList() {
    const dispatch = useDispatch();

    const patients = useSelector(
        (state) => state.patients
    );

    const newlyAddedPatients = useSelector(
        (state) => state.newlyAddedPatients
    );

    // now the component knows which batches have already been fetched.
    const fetchedBatches = useSelector(
        (state) => state.fetchedBatches
    );

    const [currentPage, setCurrentPage] = useState(1);

    const patientsPerPage = 5;

    const totalPages = Math.ceil(
        patients.length / patientsPerPage
    );

    const startIndex =
        (currentPage - 1) * patientsPerPage;

    const currentPatients = patients.slice(
        startIndex,
        startIndex + patientsPerPage
    );

    const handleFetchPatients = () => {
        dispatch({
            type: FETCH_PATIENTS,
            payload: 0
        });
    };

    const handleNextPage = () => {
        const nextPage = currentPage + 1;

        // Move to the next page
        setCurrentPage(nextPage);

        // nextPage % 2 === 0 -> This identifies the second page of each 10-record batch.
        // nextPage < 10 -> We don't need another batch after Page 10.
        if (
            nextPage % 2 === 0 &&
            nextPage < 10
        ) {
            // Calculate the next API skip 2*5 = 10 so skip first 10
            const nextBatchSkip =
                nextPage * patientsPerPage;

            // Only make the API request if we haven't already fetched this batch.
            if (!fetchedBatches.includes(nextBatchSkip)) {
                dispatch({
                    type: FETCH_PATIENTS,
                    payload: nextBatchSkip
                    // this payload gets 10
                });
            }
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handlePatientClick = (patient) => {
        dispatch({
            type: FETCH_PATIENT_DETAILS,
            payload: patient.id
        });
    };

    return (
        <div className="task017-patient-list-section">

            <div className="task017-section-header">

                <div className="task017-section-title">

                    <div className="task017-section-icon">
                        +
                    </div>

                    <div>
                        <h2>Patient List</h2>

                        <p>
                            Manage and view all patients
                        </p>
                    </div>

                </div>

                <button
                    className="task017-button task017-fetch-button"
                    onClick={handleFetchPatients}
                >
                    ↻ &nbsp; Fetch Patients
                </button>

            </div>

            <div className="task017-patient-list">

                {currentPatients.map((patient) => (
                    <div
                        className="task017-patient-item"
                        key={patient.id}
                        onClick={() => handlePatientClick(patient)}
                    >
                        <span className="task017-patient-number">
                            {patient.id}
                        </span>

                        <p>
                            {patient.firstName && patient.lastName
                                ? `${patient.firstName} ${patient.lastName}`
                                : patient.name}
                        </p>

                    </div>
                ))}

            </div>

            <div className="task017-list-footer">

                <span className="task017-showing-text">
                    Showing{" "}
                    {currentPatients.length} patients
                </span>

                <div className="task017-pagination">

                    <button
                        className="task017-pagination-button"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        ‹ &nbsp; Previous
                    </button>

                    <span className="task017-page-info">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        className="task017-pagination-button task017-next-button"
                        onClick={handleNextPage}
                        disabled={
                            currentPage === totalPages
                        }
                    >
                        Next &nbsp; ›
                    </button>

                </div>

            </div>

            {newlyAddedPatients.length > 0 && (
                <div className="task017-new-patients-section">

                    <div className="task017-section-header">

                        <div className="task017-section-title">

                            <div className="task017-section-icon">
                                +
                            </div>

                            <div>
                                <h3>Newly Added Patients</h3>

                                <p>
                                    Patients added through the registration form
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="task017-patient-list">

                        {newlyAddedPatients.map((patient, index) => (
                            <div
                                className="task017-patient-item"
                                key={`new-${index}`}
                                onClick={() =>
                                    handlePatientClick(patient)
                                }
                            >

                                <span className="task017-patient-number">
                                    {patient.id}
                                </span>

                                <p>
                                    {patient.firstName &&
                                        patient.lastName
                                        ? `${patient.firstName} ${patient.lastName}`
                                        : patient.name}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>
            )}

        </div>
    );
}

export default PatientList;