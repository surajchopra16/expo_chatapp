import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./pages/Login";
import Register from "./pages/Register";
import GroupList from "./pages/GroupList";
import Chat from "./pages/Chat";
import { API_HOST } from "../config";
import { tokenService } from "./services/token-service";
import websocketService from "./services/websocket-service";
import { useMessage } from "./state/MessagesContext";
import { AuthAPI } from "./api/auth";

/** Stack Navigator */
const Stack = createStackNavigator();

const App = () => {
    const { addMessage } = useMessage();

    /** Handle websocket connection and messages */
    useEffect(() => {
        const accessToken = tokenService.getToken();
        if (!accessToken) return;

        const userData = AuthAPI.fetchUser(accessToken);
        if (!userData) return;

        const handleMessages = (message) => {
            console.log("Received message:", message);
            addMessage(message);
        };

        // Connect to WebSocket server
        websocketService.connect(`ws://${API_HOST}/api/messages/ws?token=${accessToken}`);

        // Add listener for incoming messages
        websocketService.addListener(handleMessages);

        return () => {
            websocketService.removeListener(handleMessages);
            websocketService.disconnect();
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
