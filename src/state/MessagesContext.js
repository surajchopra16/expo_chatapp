import React, { createContext, useContext, useEffect, useState } from "react";
import { messagesService } from "../services/messages-service";
import websocketService from "../services/websocket-service";
import { API_HOST } from "../../config";
import { tokenService } from "../services/token-service";

/** Messages Context */
const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
    const [messagesByGroup, setMessagesByGroup] = useState({});
    const [loading, setLoading] = useState(true);

    /** Connect to WebSocket with access token */
    const connectWebsocket = (accessToken) => {
        // Add listener for messages and connect to Websocket server
        websocketService.addListener(addMessage);
        websocketService.connect(`ws://${API_HOST}/api/messages/ws?token=${accessToken}`);
    };

    /** Handle websocket connection on mount only */
    useEffect(() => {
        const accessToken = tokenService.getToken();
        if (!accessToken) return;

        connectWebsocket(accessToken);

        return () => {
            websocketService.disconnect();
            websocketService.removeListener(addMessage);
        };
    }, []);

    // Load the messages on mount
    useEffect(() => {
        const load = async () => {
            try {
                const data = await messagesService.loadMessages();
                setMessagesByGroup(data);
            } catch (e) {
                console.error("Failed to load messages", e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // Persist messages on change
    useEffect(() => {
        if (!loading) {
            messagesService.saveMessages(messagesByGroup).catch((e) => {
                console.error("Failed to save messages", e);
            });
        }
    }, [messagesByGroup]);

    const addMessage = (message) => {
        setMessagesByGroup((prev) => {
            const list = [...(prev[message["group_id"]] || []), message];
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            return { ...prev, [message["group_id"]]: list };
        });
    };

    const sendMessage = (message) => {
        addMessage(message);
        websocketService.sendMessage({
            group_id: message["group_id"],
            message: message["message"]
        });
    };

    return (
        <MessagesContext.Provider
            value={{ connectWebsocket, messagesByGroup, sendMessage, loading }}>
            {children}
        </MessagesContext.Provider>
    );
}

/** Custom hook to use the MessagesContext */
export const useMessagesContext = () => {
    const ctx = useContext(MessagesContext);
    if (!ctx) throw new Error("useMessage must be used within MessagesProvider");
    return { ...ctx };
};
