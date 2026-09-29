import { useSelector } from "react-redux";


function PatientDetails() {

    const patientDetails = useSelector(
        (state) => state.patientDetails
    );


    return (
        <div className="task017-patient-details-section">

            <div className="task017-details-header">

                <div className="task017-section-title">

                    <div className="task017-details-icon">
                        +
                    </div>

                    <div>
                        <h2>Patient Details</h2>

                        <p>
                            View detailed information of selected patients
                        </p>
                    </div>

                </div>

            </div>

            {patientDetails && (
                <div className="task017-details">

                    <div className="task017-avatar">
                        {patientDetails.firstName &&
                        patientDetails.lastName
                            ? (
                                patientDetails.firstName[0] +
                                patientDetails.lastName[0]
                            ).toUpperCase()
                            : "PT"}
                    </div>

                    <div className="task017-detail-field">
                        <span>Name</span>
                        <strong>
                            {patientDetails.firstName}{" "}
                            {patientDetails.lastName}
                        </strong>
                    </div>

                    <div className="task017-detail-field">
                        <span>ID</span>
                        <strong>
                            {patientDetails.id}
                        </strong>
                    </div>

                    <div className="task017-detail-field">
                        <span>Email</span>
                        <strong>
                            {patientDetails.email}
                        </strong>
                    </div>

                    <div className="task017-detail-field">
                        <span>Phone</span>
                        <strong>
                            {patientDetails.phone}
                        </strong>
                    </div>

                </div>
            )}

        </div>
    );
}

export default PatientDetails;