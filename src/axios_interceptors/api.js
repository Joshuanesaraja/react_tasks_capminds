// Creating Axios instance
import axios from "axios";

const api = axios.create({
    baseURL: "https://dummyjson.com"
});

// Mock refresh-token function
const refreshAccessToken = async () => {
    console.log("Refreshing access token...");

    return "new-access-token";
};

// Request interceptor
api.interceptors.request.use(

    // Runs before Axios sends the request to the API
    (config) => {
        const token = localStorage.getItem("token");

        // Add access token to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log("Request Interceptor:", config);

        // Return the modified request configuration
        return config;
    },

    // Handles request errors
    (error) => {
        return Promise.reject(error);
    }
);

// Ejecting an Axios Interceptor -> to test uncomment this block
// const testInterceptor = api.interceptors.request.use(
//     (config) => {
//         console.log("Test Interceptor is running");

//         return config;
//     }
// );

// api.interceptors.request.eject(testInterceptor);

// Response interceptor
api.interceptors.response.use(

    // Runs when the API request is successful
    (response) => {
        return response;
    },

    // Handles API response errors
    async (error) => {

        // Handle 401 Unauthorized only once
        if (error.response?.status === 401 && !error.config._retry) {

            // Prevent infinite retry loops
            error.config._retry = true;

            // Get a new access token
            const newToken = await refreshAccessToken();

            // Add the new token to the original request
            error.config.headers.Authorization = `Bearer ${newToken}`;

            console.log("Retrying original request...");

            // Retry the original request
            return api(error.config);
        }

        return Promise.reject(error);
    }
);

// error.config -> It contains the configuration of the original request that failed.

export default api;