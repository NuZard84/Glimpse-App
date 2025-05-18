import { LOGOUT, SET_IS_FORGOT_PASSWORD, SET_USER_ACCESS_TOKEN, SET_USER_PROFILE, SET_USER_VERIFIED, SET_USERNAME } from "../types"

export type UserState = {
    isVarified: boolean,
    accessToken: string | null,
    isForgotPassword: boolean,
    profile: {
        _id?: string,
        username: string,
        email: string,
        phoneNumber: string
    }
}

const initialState: UserState = {
    isVarified: false,
    accessToken: null,
    isForgotPassword: false,
    profile: {
        username: "",
        email: "",
        phoneNumber: ""
    },
}

export default function userReducer(state = initialState, action: any): UserState {
    switch (action.type) {
        case SET_USER_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.payload
            }
        case SET_USER_VERIFIED:
            return {
                ...state,
                isVarified: action.payload
            }
        case SET_USER_PROFILE:
            return {
                ...state,
                profile: action.payload
            }
        case SET_USERNAME:
            return {
                ...state,
                profile: { ...state.profile, username: action.payload }
            }
        case SET_IS_FORGOT_PASSWORD:
            return {
                ...state,
                isForgotPassword: action.payload
            }
        case LOGOUT:
            return {
                accessToken: null,
                isVarified: false,
                isForgotPassword: false,
                profile: {
                    username: "",
                    email: "",
                    phoneNumber: ""
                }
            };
        default:
            return state;
    }
} 
