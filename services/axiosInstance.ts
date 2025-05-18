import { store } from "@/redux/store";
import axios, { AxiosError, AxiosResponse } from "axios";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Update the base URL of the API instance
 * @param newBaseUrl - The new base URL to use
 */
const updateBaseUrl = (newBaseUrl: string) => {
    if (newBaseUrl) {
        console.log("Base URL updated to:", newBaseUrl);
        axiosInstance.defaults.baseURL = newBaseUrl;
    }
};

/**
 * Manually set the authorization token for API requests
 * @param token - The auth token to use (without 'Bearer ' prefix)
 */
const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Auth token set manually");
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
        console.log("Auth token removed");
    }
};

// Add request interceptor to include auth token from Redux store
axiosInstance.interceptors.request.use(
    (config) => {
        // Get current state from Redux store
        const state = store.getState();
        const token = state.user?.accessToken?.trim();

        console.log("Token:", token);

        // If token exists, add it to request headers
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Handle response interceptor for common error patterns
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Successfully received response
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const { status, data } = error.response;

            console.error(`API Error ${status}:`, data);

            switch (status) {
                case 401:
                    // Unauthorized - Token might be expired or invalid
                    console.log("Authentication error - User needs to login again");
                    break;

                case 403:
                    // Forbidden - User doesn't have permission
                    console.log("Permission denied");
                    break;

                case 404:
                    // Not found
                    console.log("Resource not found");
                    break;

                case 500:
                case 502:
                case 503:
                    // Server errors
                    console.log("Server error occurred");
                    break;

                default:
                    // Other error codes
                    console.log(`Unexpected error with status code: ${status}`);
            }
        } else if (error.request) {
            // The request was made but no response was received
            // Likely a network error
            console.error("Network Error - No response received:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Request setup error:", error.message);
        }

        // Return the error for further handling
        return Promise.reject(error);
    }
);

export { setAuthToken, updateBaseUrl };
export default axiosInstance;
