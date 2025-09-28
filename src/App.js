import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./pages/Login";
import Register from "./pages/Register";
import GroupList from "./pages/GroupList";
import Chat from "./pages/Chat";

import { AuthAPI } from "./api/auth";
import { tokenService } from "./services/token-service";

/** Stack Navigator */
const Stack = createStackNavigator();

const App = () => {
    useEffect(() => {
        const access_token = tokenService.getToken();
        if (access_token) return;

        AuthAPI.fetchUser(access_token).then();
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
