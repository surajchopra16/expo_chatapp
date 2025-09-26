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
import { useMessagesContext } from "../state/MessagesContext";
import { tokenService } from "../services/token-service";

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
    const { group_id, groupName } = route.params || { groupName: "Secure Group" };

    const { messagesByGroup, sendMessage } = useMessagesContext();

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    const currentUser = tokenService.getUser();

    const flatListRef = useRef();

    // Load messages for the current group
    useEffect(() => {
        if (messagesByGroup && group_id && messagesByGroup[group_id]) {
            const groupMessages = messagesByGroup[group_id].map((msg, index) => ({
                id: `${msg.group_id}_${index}`,
                text: msg.message,
                sender: msg.sender_username,
                isCurrentUser: msg.sender_id === currentUser?._id,
                timestamp: new Date(msg.created_at).toLocaleTimeString()
            }));
            setMessages(groupMessages);
        }
    }, [messagesByGroup, group_id]);

    // Scroll to the bottom when messages change
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const message = inputMessage.trim();
        setInputMessage("");

        sendMessage({
            group_id: group_id,
            group_name: groupName,
            sender_id: currentUser?._id,
            sender_username: currentUser?.username,
            message: message,
            created_at: Date.now()
        });
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
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    multiline
                />

                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}
                    disabled={!inputMessage.trim()}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Chat;
