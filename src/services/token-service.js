import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/** Token key for storage */
const TOKEN_KEY = "user_access_token";

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

export const tokenService = { setToken, getToken, deleteToken };
