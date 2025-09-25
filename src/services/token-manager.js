import * as SecureStore from "expo-secure-store";

/** Token key for storage */
const TOKEN_KEY = "user_access_token";

/** Determine if running in a browser environment */
const isBrowser =
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof localStorage !== "undefined";

/** Set the token in secure storage or localStorage */
const setToken = (token) => {
    if (!token) return false;

    try {
        if (isBrowser) localStorage.setItem(TOKEN_KEY, token);
        else SecureStore.setItem(TOKEN_KEY, token);
        return true;
    } catch {
        return false;
    }
};

/** Get the token from secure storage or localStorage */
const getToken = () => {
    try {
        if (isBrowser) return localStorage.getItem(TOKEN_KEY);
        else return SecureStore.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
};

/** Delete the token from secure storage or localStorage */
const deleteToken = async () => {
    try {
        if (isBrowser) localStorage.removeItem(TOKEN_KEY);
        else await SecureStore.deleteItemAsync(TOKEN_KEY);
        return true;
    } catch {
        return false;
    }
};

export const tokenManager = { setToken, getToken, deleteToken };
