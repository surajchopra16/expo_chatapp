import React, { createContext, useContext, useEffect, useState } from "react";
import { messagesService } from "../services/messages-service";
import websocketService from "../services/websocket-service";
import { API_HOST } from "../../config";
import { tokenService } from "../services/token-service";
import { decryptMessage, encryptMessage } from "../services/e2ee";

/** Messages Context */
const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
    const [messagesByGroup, setMessagesByGroup] = useState({});
    const [loading, setLoading] = useState(true);

    /** Connect to WebSocket with access token */
    const connectWebsocket = (accessToken) => {
        // Add listener for messages and connect to Websocket server
        websocketService.addListener(addMessageWithDecryption);
        websocketService.connect(`ws://${API_HOST}/api/messages/ws?token=${accessToken}`);
    };

    /** Handle websocket connection on mount only */
    useEffect(() => {
        const accessToken = tokenService.getToken();
        if (!accessToken) return;

        connectWebsocket(accessToken);

        return () => {
            websocketService.disconnect();
            websocketService.removeListener(addMessageWithDecryption);
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

    /** Add a message without decryption (used for sending messages) */
    const addMessageWithoutDecryption = (message) => {
        setMessagesByGroup((prev) => {
            const list = [...(prev[message["group_id"]] || []), message];
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            return { ...prev, [message["group_id"]]: list };
        });
    };

    /** Add a message with decryption (used for receiving messages) */
    const addMessageWithDecryption = (message) => {
        const symmetricKey = tokenService.getSymmetricKey(message["group_id"]);
        if (!symmetricKey) {
            console.error("No symmetric key found for group:", message["group_id"]);
            return;
        }

        // Decrypt the message content
        let msg;

        if (typeof message["message"] === "string") {
            msg = { ...message, message: decryptMessage(symmetricKey, message["message"]) };
        } else {
            msg = {
                ...message,
                message: {
                    ...message.message,
                    url: decryptMessage(symmetricKey, message["message"]["url"])
                }
            };
        }

        addMessageWithoutDecryption(msg);
    };

    /** Send a message through the websocket */
    const sendTextMessage = ({ group_id, message }) => {
        const symmetricKey = tokenService.getSymmetricKey(group_id);
        if (!symmetricKey) {
            console.error("No symmetric key found for group:", group_id);
            return;
        }

        websocketService.sendMessage({ group_id, message: encryptMessage(symmetricKey, message) });
    };

    /** Send a file message through the websocket */
    const sendFileMessage = ({ group_id, message }) => {
        const symmetricKey = tokenService.getSymmetricKey(group_id);
        if (!symmetricKey) {
            console.error("No symmetric key found for group:", group_id);
            return;
        }

        websocketService.sendMessage({
            group_id,
            message: { ...message, url: encryptMessage(symmetricKey, message["url"]) }
        });
    };

    return (
        <MessagesContext.Provider
            value={{
                connectWebsocket,
                messagesByGroup,
                addMessageWithoutDecryption,
                sendTextMessage,
                sendFileMessage,
                loading
            }}>
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
