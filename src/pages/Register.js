import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/RegisterStyles";
import { AuthAPI } from "../api/auth";
import { useMessagesContext } from "../state/MessagesContext";

const ShieldIcon = () => (
    <View style={styles.shieldIcon}>
        <Text style={styles.shieldText}>🛡️</Text>
    </View>
);

const EyeIcon = ({ onPress, isVisible }) => (
    <TouchableOpacity onPress={onPress} style={styles.eyeIcon}>
        <Text style={styles.eyeText}>{isVisible ? "👁️" : "👁️‍🗨️"}</Text>
    </TouchableOpacity>
);

const Register = ({ navigation }) => {
    const { connectWebsocket } = useMessagesContext();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const result = await AuthAPI.register(username.trim(), email.trim(), password);

            if (result.success) {
                connectWebsocket(result.access_token);
                navigation.navigate("GroupList");
            } else {
                Alert.alert("Registration Failed", result.error);
            }
        } catch {
            Alert.alert("Error", "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{"<"}</Text>
                </TouchableOpacity>
                <View style={styles.secureIconContainer}>
                    <ShieldIcon />
                    <Text style={styles.secureLabel}> VPN </Text>
                </View>
            </View>
            <KeyboardAvoidingView
                behavior="padding"
                style={[styles.keyboardAvoidingView, { paddingVertical: 24 }]}
                keyboardVerticalOffset={0}>
                <ScrollView
                    contentContainerStyle={[styles.scrollViewContent, { paddingBottom: 32 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>Create Your Secure Account</Text>
                    <Text style={styles.subtitle}>Enter your details below</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#8A8A8A"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email Address ID"
                        placeholderTextColor="#8A8A8A"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#8A8A8A"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                        />
                        <EyeIcon
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            isVisible={isPasswordVisible}
                        />
                    </View>

                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor="#8A8A8A"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!isConfirmPasswordVisible}
                        />
                        <EyeIcon
                            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            isVisible={isConfirmPasswordVisible}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.registerButton, loading && { opacity: 0.7 }]}
                        onPress={handleRegister}
                        disabled={loading}>
                        <Text style={styles.registerButtonText}>
                            {loading ? "REGISTERING..." : "REGISTER"}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.encryptionNote}>Your info is end-to-end encrypted.</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Register;
