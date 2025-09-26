import React, { createContext, useContext, useEffect, useState } from "react";
import { messagesService } from "../services/messages-service";

/** Messages Context */
const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
    const [messagesByGroup, setMessagesByGroup] = useState({});
    const [loading, setLoading] = useState(true);

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

    return (
        <MessagesContext.Provider value={{ messagesByGroup, addMessage, loading }}>
            {children}
        </MessagesContext.Provider>
    );
}

export const useMessage = () => {
    const ctx = useContext(MessagesContext);
    if (!ctx) throw new Error("useMessage must be used within MessagesProvider");
    return { ...ctx };
};
