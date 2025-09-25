import React, { createContext, useContext, useState } from "react";

/** Messages Context */
const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
    const [messagesByGroup, setMessagesByGroup] = useState({});

    const addMessage = (m) => {
        setMessagesByGroup((prev) => {
            const list = [...(prev[m.groupId] || []), m];
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            return { ...prev, [m.groupId]: list };
        });
    };

    return (
        <MessagesContext.Provider value={{ messagesByGroup, addMessage }}>
            {children}
        </MessagesContext.Provider>
    );
}

export const useMessagesMap = () => {
    const ctx = useContext(MessagesContext);
    if (!ctx) throw new Error("useMessagesMap must be used within MessagesProvider");
    return ctx.messagesByGroup;
};

export const useAddMessage = () => {
    const ctx = useContext(MessagesContext);
    if (!ctx) throw new Error("useAddMessage must be used within MessagesProvider");
    return ctx.addMessage;
};

export const useGroupMessages = (groupId) => {
    const map = useMessagesMap();
    return map[groupId] || [];
};
