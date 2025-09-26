import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/** Token key for storage */
const TOKEN_KEY = "user_access_token";
const USER_DATA_KEY = "user_data";

/** Check if the platform is web */
const isWeb = Platform.OS === "web";

/** Set the token in secure storage or localStorage */
const setToken = (token) => {
    if (!token) return false;

    try {
        if (isWeb) localStorage.setItem(TOKEN_KEY, token);
        else SecureStore.setItem(TOKEN_KEY, token);
        return true;
    } catch {
        return false;
    }
};

/** Get the token from secure storage or localStorage */
const getToken = () => {
    try {
        if (isWeb) return localStorage.getItem(TOKEN_KEY);
        else return SecureStore.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

/** Delete the token from secure storage or localStorage */
const deleteToken = async () => {
    try {
        if (isWeb) localStorage.removeItem(TOKEN_KEY);
        else await SecureStore.deleteItemAsync(TOKEN_KEY);
        return true;
    } catch {
        return false;
    }
};

/** Set user data in secure storage or localStorage */
const setUser = (user) => {
    if (!user) return false;

    try {
        if (isWeb) localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
        else SecureStore.setItem(USER_DATA_KEY, JSON.stringify(user));
        return true;
    } catch {
        return false;
    }
};

/** Get user data from secure storage or localStorage */
const getUser = () => {
    try {
        if (isWeb) {
            const userData = localStorage.getItem(USER_DATA_KEY);
            return userData ? JSON.parse(userData) : null;
        } else {
            const userData = SecureStore.getItem(USER_DATA_KEY);
            return userData ? JSON.parse(userData) : null;
        }
    } catch {
        return null;
    }
};

export const tokenService = { setToken, getToken, deleteToken, setUser, getUser };
