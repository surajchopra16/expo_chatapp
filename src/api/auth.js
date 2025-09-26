import { API_HOST } from "../../config";
import { tokenService } from "../services/token-service";

/** Login user */
const login = async (username, password) => {
    try {
        const response = await fetch(`http://${API_HOST}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");

        // Save the access token
        const isSet = tokenService.setToken(data.access_token);
        if (!isSet) throw new Error("Failed to persist token");

        return {
            success: true,
            message: data.message,
            token_type: data.token_type,
            access_token: data.access_token
        };
    } catch (err) {
        return { success: false, error: err.message || "Network error occurred" };
    }
};

/** Register user */
const register = async (username, email, password) => {
    try {
        const response = await fetch(`http://${API_HOST}/api/users/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Registration failed");

        // Save the access token
        const isSet = tokenService.setToken(data.access_token);
        if (!isSet) throw new Error("Failed to persist token");

        return {
            success: true,
            message: data.message,
            token_type: data.token_type,
            access_token: data.access_token
        };
    } catch (err) {
        return { success: false, error: err.message || "Network error occurred" };
    }
};

/** Fetch current user */
const fetchUser = async (token) => {
    try {
        const response = await fetch(`http://${API_HOST}/api/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch user");

        const isSet = tokenService.setUser(data);
        if (!isSet) throw new Error("Failed to persist user data");

        return { success: true, user: data };
    } catch (err) {
        return { success: false, error: err.message || "Network error occurred" };
    }
};

export const AuthAPI = { login, register, fetchUser };
