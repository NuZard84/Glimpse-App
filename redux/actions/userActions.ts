import { LOGOUT, SET_IS_FORGOT_PASSWORD, SET_USER_ACCESS_TOKEN, SET_USER_PROFILE, SET_USER_VERIFIED, SET_USERNAME } from "../types";

interface UserProfile {
    _id?: string;
    username: string;
    email: string;
    phoneNumber: string;
}

export const setUserProfile = (profile: UserProfile) => {
    return {
        type: SET_USER_PROFILE,
        payload: profile
    };
}

export const setUsernameToProfile = (username: string) => {
    return {
        type: SET_USERNAME,
        payload: username
    };
}

export const setUserAccessToken = (accessToken: string) => {
    return {
        type: SET_USER_ACCESS_TOKEN,
        payload: accessToken
    };
}

export const setUserVerified = (isVerified: boolean) => {
    return {
        type: SET_USER_VERIFIED,
        payload: isVerified
    };
}

export const setIsForgotPassword = (isForgotPassword: boolean) => {
    return {
        type: SET_IS_FORGOT_PASSWORD,
        payload: isForgotPassword
    };
}


export const logout = () => {
    return {
        type: LOGOUT,
    };
};
