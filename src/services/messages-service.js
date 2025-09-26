import { Platform } from "react-native";
import AsyncStorageRN from "@react-native-async-storage/async-storage";

/** Storage key */
const STORAGE_KEY = "messages_by_group";

/** Check if the platform is web */
const isWeb = Platform.OS === "web";

/** Save messages */
const saveMessages = async (messages) => {
    try {
        const json = JSON.stringify(messages);
        if (isWeb) {
            localStorage.setItem(STORAGE_KEY, json);
        } else {
            await AsyncStorageRN.setItem(STORAGE_KEY, json);
        }
    } catch (error) {
        console.error("Error saving messages:", error);
    }
};

/** Load messages */
const loadMessages = async () => {
    try {
        if (isWeb) {
            const json = localStorage.getItem(STORAGE_KEY);
            return json ? JSON.parse(json) : {};
        } else {
            const json = await AsyncStorageRN.getItem(STORAGE_KEY);
            return json ? JSON.parse(json) : {};
        }
    } catch (error) {
        console.error("Error loading messages:", error);
        return {};
    }
};

export const messagesService = { saveMessages, loadMessages };
