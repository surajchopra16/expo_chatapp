import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./pages/Login";
import Register from "./pages/Register";
import GroupList from "./pages/GroupList";
import Chat from "./pages/Chat";
import { API_HOST } from "../config";
import { tokenManager } from "./services/token-manager";
import websocketManager from "./services/websocket-manager";
import { useAddMessage } from "./state/MessagesContext";

/** Stack Navigator */
const Stack = createStackNavigator();

const App = () => {
    const addMessage = useAddMessage();

    /** Handle websocket connection and messages */
    useEffect(() => {
        const accessToken = tokenManager.getToken();
        if (!accessToken) return;

        const handleMessages = (message) => {
            console.log("Received message:", message);
            addMessage(message);
        };

        // Connect to WebSocket server
        websocketManager.connect(`ws://${API_HOST}/api/messages/ws?token=${accessToken}`);

        // Add listener for incoming messages
        websocketManager.addListener(handleMessages);

        return () => {
            websocketManager.removeListener(handleMessages);
            websocketManager.disconnect();
        };
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator
                id="MainStack"
                initialRouteName="GroupList"
                screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="GroupList" component={GroupList} />
                <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
