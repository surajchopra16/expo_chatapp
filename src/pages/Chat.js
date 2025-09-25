import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/ChatStyles";

// Component for rendering a single message
const MessageBubble = ({ message }) => (
    <View
        style={[
            styles.messageBubble,
            message.isCurrentUser ? styles.myMessage : styles.otherMessage
        ]}>
        {!message.isCurrentUser && <Text style={styles.senderName}>{message.sender}</Text>}
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
    </View>
);

const Chat = ({ navigation, route }) => {
    // Get group name from navigation parameters
    const { groupName } = route.params || { groupName: "Secure Group" };

    // Initialize from route params (or empty); remove getGroupMessages
    const [messages, setMessages] = useState(() => route.params?.messages ?? []);
    const [newMessage, setNewMessage] = useState("");
    const flatListRef = useRef(); // Ref for auto-scrolling

    // Scroll to the bottom when messages change
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        // Append locally; remove addMessage
        const outgoing = {
            id: Date.now().toString(),
            text: newMessage.trim(),
            sender: "You",
            isCurrentUser: true,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages((prev) => [...prev, outgoing]);
        setNewMessage("");
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{"<"}</Text>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.groupTitle}>{groupName}</Text>
                    <Text style={styles.onlineStatus}>online</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>📞</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreOptionsButton}>
                        <Text style={styles.moreOptionsText}>⋮</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Message List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => <MessageBubble message={item} />}
                // Safe keyExtractor if items lack id
                keyExtractor={(item, index) => item.id ?? String(index)}
                contentContainerStyle={styles.messageListContent}
                onContentSizeChange={() =>
                    messages.length > 0 && flatListRef.current.scrollToEnd({ animated: true })
                }
                ListEmptyComponent={() => (
                    <View style={{ padding: 24, alignItems: "center" }}>
                        <Text style={{ color: "#888" }}>
                            No messages yet. Start the conversation.
                        </Text>
                    </View>
                )}
            />

            {/* Message Input Area */}
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={0}
                style={styles.inputContainer}>
                <TextInput
                    style={styles.messageInput}
                    placeholder="Type a secure message..."
                    placeholderTextColor="#8A8A8A"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim()}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Chat;
