import axios from 'axios';
import Constants from 'expo-constants';
import axiosInstance from './axiosInstance';

const API_URL = Constants.expoConfig?.extra?.apiUrl


export const SignUp = async (email: string, password: string, phoneNumber: string) => {
    try {
        const response = await axios.post(`${API_URL}/users/sign-up`, {
            email,
            password,
            mobile: phoneNumber
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("SignUp Success Response:", JSON.stringify(response.data));
        return response.data;

    } catch (error: any) {
        console.error("SignUp Error:", error?.response?.data?.message || error?.message);
        console.log("Full error response:", JSON.stringify(error?.response?.data || {}));

        // Return the error response data if available
        if (error.response && error.response.data) {
            return {
                error: true,
                ...error.response.data
            };
        }
        // Return a formatted error object if no response data
        return { error: true, message: error?.message || 'Sign up failed' };
    }
}


export const SignIn = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/users/sign-in`, {
            emailOrUserName: email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (error: any) {
        // Log the full error response to see what's coming back
        console.error("SignIn Error:", error?.response?.data?.message || error?.message);
        console.log("Full error response:", JSON.stringify(error?.response?.data || {}));

        // Return the error response data if available
        if (error.response && error.response.data) {
            if (error.response.data.error === "Please verify your email!" ||
                error.response.data.message?.includes("verify") ||
                error.response.status === 400) {
                return {
                    error: true,
                    needsVerification: true,
                    ...error.response.data
                };
            }


            return {
                error: true,
                ...error.response.data
            };
        }

        return { error: true, message: error?.message || 'Sign in failed' };
    }
}


export const SendOTP = async (email: string) => {
    try {
        const response = await axios.post(`${API_URL}/users/send-otp`, {
            email
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (error: any) {
        console.error("SendOTP Error:", error?.response?.data?.message || error?.message);
        console.log("Full error response:", JSON.stringify(error?.response?.data || {}));

        // Return the error response data if available
        if (error.response && error.response.data) {
            return {
                error: true,
                ...error.response.data
            };
        }
        // Return a formatted error object if no response data
        return { error: true, message: error?.message || 'Failed to send OTP' };
    }
}


export const VerifyOTP = async (email: string, otp: string) => {
    try {
        const response = await axios.post(`${API_URL}/users/verification`, {
            email,
            otp
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error: any) {
        console.error("VerifyOTP Error:", error?.response?.data?.message || error?.message);
        console.log("Full error response:", JSON.stringify(error?.response?.data || {}));

        // Return the error response data if available
        if (error.response && error.response.data) {
            // If the error is about expired OTP, mark it specially
            if (error.response.data.message?.includes("Expired") ||
                error.response.data.message?.includes("expired")) {
                return {
                    error: true,
                    otpExpired: true,
                    ...error.response.data
                };
            }

            return {
                error: true,
                ...error.response.data
            };
        }
        // Return a formatted error object if no response data
        return { error: true, message: error?.message || 'OTP verification failed' };
    }
}


export const SetUsername = async (username: string) => {
    try {

        const response = await axiosInstance.post('/users/add-userName', {
            userName: username
        });

        return response.data;
    } catch (error: any) {
        console.error("SetUsername Error:", error?.response?.data?.message || error?.message);
        // Return the error response data if available
        if (error.response && error.response.data) {
            return error.response.data;
        }
        // Return a formatted error object if no response data
        return { error: true, message: error?.message || 'Failed to set username' };
    }
}

export const ResetPassqord = async (password: string) => {
    try {
        const response = await axiosInstance.post('/users/reset-password', {
            password
        });

        return response.data;
    } catch (error: any) {
        console.error("ResetPassqord Error:", error?.response?.data?.message || error?.message);
        return { error: true, message: error?.message || 'Failed to reset password' };
    }
}
