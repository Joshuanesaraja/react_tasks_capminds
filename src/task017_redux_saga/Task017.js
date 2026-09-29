import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import PatientDetails from "./components/PatientDetails";
import StatusMessage from "./components/StatusMessage";

import {
    NETWORK_ONLINE,
    NETWORK_OFFLINE,
    LOAD_OFFLINE_QUEUE
} from "./redux/actions";

import "./Task017.css";

function Task017() {
    const dispatch = useDispatch();

    const initialized = useRef(false);

    // useEffect() -> We only want to register the browser event listener when the component is mounted,
    // and remove it when the component is unmounted.

    useEffect(() => {

        // preventing the initial startup logic from running twice.
        if (!initialized.current) {

            initialized.current = true;

            dispatch({
                type: LOAD_OFFLINE_QUEUE
            });

            if (navigator.onLine) {
                dispatch({
                    type: NETWORK_ONLINE
                });
            }
        }

        // When the connection comes back:
        const handleOnline = () => {
            dispatch({
                type: NETWORK_ONLINE
            });
        };

        const handleOffline = () => {
            dispatch({
                type: NETWORK_OFFLINE
            });
        };

        // Setup

        // The browser provides an online event.
        // We listen for it:
        window.addEventListener(
            "online",
            handleOnline
        );

        window.addEventListener(
            "offline",
            handleOffline
        );

        // Cleanup
        return () => {

            window.removeEventListener(
                "online",
                handleOnline
            );

            window.removeEventListener(
                "offline",
                handleOffline
            );
        };

    }, [dispatch]);

    return (
        <div className="task017-container">

            <header className="task017-header">

                <div className="task017-title-section">
                    <div className="task017-title-icon">
                        +
                    </div>

                    <div>
                        <h1>
                            Healthcare Doctor Dashboard
                        </h1>

                        <p>
                            Redux Saga - Performance & Reliability
                        </p>
                    </div>
                </div>

                <StatusMessage />

            </header>

            <main className="task017-content">

                <section className="task017-card task017-patient-card">
                    <PatientList />
                </section>

                <section className="task017-card task017-form-card">
                    <PatientForm />
                </section>

                <section className="task017-card task017-details-card">
                    <PatientDetails />
                </section>

            </main>

            <footer className="task017-footer">
                Task 017 - React + Redux + Redux Saga
            </footer>

        </div>
    );
}

export default Task017;

