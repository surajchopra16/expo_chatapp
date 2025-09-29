import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Image,
    Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/ChatStyles";
import { useMessagesContext } from "../state/MessagesContext";
import { tokenService } from "../services/token-service";
import * as DocumentPicker from "expo-document-picker";
import { API_HOST } from "../../config";

/** Message bubble component */
const MessageBubble = ({ message }) => (
    <View
        style={[
            styles.messageBubble,
            message.isCurrentUser ? styles.myMessage : styles.otherMessage
        ]}>
        {!message.isCurrentUser && <Text style={styles.senderName}>{message.sender}</Text>}
        {message.kind === "file" ? (
            <File file={message.file} />
        ) : (
            <Text style={styles.messageText}>{message.text}</Text>
        )}
        <Text style={styles.timestamp}>{message.timestamp}</Text>
    </View>
);

/** File component */
const File = ({ file }) => {
    const name = file.filename || "";
    const url = file.url;
    const mime = (file.mime || "").toLowerCase();
    const isImage = mime.startsWith("image/") || /\.(png|jpe?g|gif|webp)$/i.test(name || url);
    const isPdf = mime === "application/pdf" || /\.pdf$/i.test(name || url);

    const open = () => Linking.openURL(url);

    const openPdf = () => {
        const externalUrl = /^https?:\/\//i.test(url)
            ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`
            : url;
        Linking.openURL(externalUrl);
    };

    if (isImage) {
        return (
            <TouchableOpacity activeOpacity={0.8} style={{ maxWidth: 260 }}>
                <Image
                    source={{ uri: url }}
                    style={{ width: 240, height: 240, borderRadius: 8, backgroundColor: "#111" }}
                    resizeMode="cover"
                />
                {!!name && (
                    <Text style={{ marginTop: 6, color: "#ddd" }} numberOfLines={1}>
                        {name}
                    </Text>
                )}
            </TouchableOpacity>
        );
    }

    if (isPdf) {
        return (
            <TouchableOpacity onPress={openPdf} activeOpacity={0.8} style={{ maxWidth: 260 }}>
                <View
                    style={{
                        width: 240,
                        height: 160,
                        backgroundColor: "#111",
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#222"
                    }}>
                    <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>PDF</Text>
                    <Text style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>Tap to open</Text>
                </View>

                <Text style={{ marginTop: 6, color: "#ddd" }} numberOfLines={1}>
                    {name || "PDF document"}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={open} activeOpacity={0.8}>
            <Text style={{ color: "#8ecaff", textDecorationLine: "underline" }}>
                {name || "Attachment"}
            </Text>
        </TouchableOpacity>
    );
};

const Chat = ({ navigation, route }) => {
    const { group_id, groupName } = route.params || { groupName: "Secure Group" };

    const { messagesByGroup, addMessageWithoutDecryption, sendTextMessage, sendFileMessage } =
        useMessagesContext();

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    const currentUser = tokenService.getUser();

    const flatListRef = useRef();

    /** Scroll to bottom on new messages */
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    /** Load messages for the current group */
    useEffect(() => {
        if (messagesByGroup && group_id && messagesByGroup[group_id]) {
            const groupMessages = messagesByGroup[group_id].map((msg, index) => {
                const payload = msg.message;
                const base = {
                    id: `${msg.group_id}_${index}`,
                    sender: msg.sender_username,
                    isCurrentUser: msg.sender_id === currentUser?._id,
                    timestamp: new Date(msg.created_at).toLocaleTimeString()
                };

                // Determine if the message is a file or text
                if (payload && typeof payload === "object" && payload.type === "file") {
                    const filename = payload.filename || "";
                    const url = payload.url || "";

                    const mime = (
                        payload.mime ||
                        guessMimeFromName(filename) ||
                        guessMimeFromName(url) ||
                        ""
                    ).toLowerCase();

                    return {
                        ...base,
                        kind: "file",
                        file: { filename, url, mime }
                    };
                }

                return {
                    ...base,
                    kind: "text",
                    text: String(payload ?? "")
                };
            });
            setMessages(groupMessages);
        }
    }, [messagesByGroup, group_id]);

    /** Guess MIME type from filename or URL */
    const guessMimeFromName = (nameOrUrl = "") => {
        const m = (nameOrUrl.split("?")[0] || "").match(/\.(\w+)$/i);
        const ext = (m && m[1] ? m[1] : "").toLowerCase();

        switch (ext) {
            case "png":
                return "image/png";
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "pdf":
                return "application/pdf";
            default:
                return "";
        }
    };

    /** Handle sending a text message */
    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const message = inputMessage.trim();
        setInputMessage("");

        const msg = {
            group_id: group_id,
            group_name: groupName,
            sender_id: currentUser?._id,
            sender_username: currentUser?.username,
            message: message,
            created_at: Date.now()
        };

        addMessageWithoutDecryption(msg);
        sendTextMessage({ group_id: msg["group_id"], message: msg["message"] });
    };

    /** Pick a file and upload it */
    const pickAndUploadFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["image/png", "image/jpeg", "application/pdf"],
                copyToCacheDirectory: true
            });

            // Handle the case when the user cancels the picker
            if (result.canceled) {
                console.log("User cancelled the document picker");
                return;
            }

            const asset = result.assets[0];
            await uploadFile({
                uri: asset.uri,
                name: asset.name,
                type: asset.mimeType || "application/octet-stream"
            });
        } catch (err) {
            console.error("File pick/upload error:", err);
            if (!String(err).includes("Upload failed")) {
                Alert.alert("Error", "An unexpected error occurred.");
            }
        }
    };

    /** Upload a file to the server and add a message */
    const uploadFile = async ({ uri, name, type }) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", { uri, name, type });

            const response = await fetch(
                `http://${API_HOST}/api/messages/upload?access_token=${encodeURIComponent(tokenService.getToken())}`,
                { method: "POST", body: formData }
            );
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Something went wrong");
            }

            const message = {
                group_id: group_id,
                group_name: groupName,
                sender_id: currentUser?._id,
                sender_username: currentUser?.username,
                message: result,
                created_at: Date.now()
            };
            addMessageWithoutDecryption(message);
            sendFileMessage({ group_id: message["group_id"], message: result });
        } catch (e) {
            console.error("Upload error:", e);
            Alert.alert("Upload failed", e?.message || "Could not upload the file.");
        } finally {
            setUploading(false);
        }
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
                {/* Attach button */}
                <TouchableOpacity
                    onPress={pickAndUploadFile}
                    disabled={uploading}
                    style={{
                        paddingHorizontal: 5,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text style={{ fontSize: 20, color: uploading ? "#999" : "#fff" }}>
                        {uploading ? "…" : "📎"}
                    </Text>
                </TouchableOpacity>

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
