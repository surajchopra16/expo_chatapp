import { useEffect, useState } from "react";
import { FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/GroupListStyles";
import { tokenService } from "../services/token-service";

const GroupItem = ({ item, onPress }) => {
    const lastMsg = item.messages?.[item.messages.length - 1];
    return (
        <TouchableOpacity style={styles.groupItemContainer} onPress={onPress}>
            <View style={styles.groupIcon}>
                <Text style={styles.groupIconText}>{item.name.charAt(0)}</Text>
            </View>

            <View style={styles.groupTextContainer}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.lastMessage}>{lastMsg?.text ?? ""}</Text>
            </View>

            <View style={styles.groupMetaContainer}>
                <Text style={styles.timestamp}>{lastMsg?.timestamp ?? ""}</Text>
                {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unreadCount}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const fetchUserGroups = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/users/user-groups", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenService.getToken()}`
            }
        });
        const data = await response.json();

        return data.groups || [];
    } catch (error) {
        console.error("Error fetching user groups:", error);
        return [];
    }
};

const GroupList = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text) {
            const q = text.toLowerCase();
            setFilteredGroups(groups.filter((g) => g.name.toLowerCase().includes(q)));
        } else {
            setFilteredGroups(groups);
        }
    };

    useEffect(() => {
        const access_token = tokenService.getToken();
        if (!access_token) navigation.navigate("Login");

        // Fetch groups data
        const loadGroups = async () => {
            setLoading(true);
            const groupsData = await fetchUserGroups();
            setGroups(groupsData);
            setFilteredGroups(groupsData);
            setLoading(false);
        };

        loadGroups();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Secure Groups</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search groups..."
                    placeholderTextColor="#8A8A8A"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Group List */}
            <FlatList
                data={filteredGroups}
                renderItem={({ item }) => (
                    <GroupItem
                        item={item}
                        onPress={() =>
                            navigation.navigate("Chat", {
                                groupName: item.name,
                                group_id: item._id
                            })
                        }
                    />
                )}
                keyExtractor={(item) => item._id}
                style={styles.listContainer}
                ListEmptyComponent={() => (
                    <View style={{ padding: 32, alignItems: "center" }}>
                        <Text style={{ color: "#999" }}>
                            {loading ? "Loading groups..." : "No groups found."}
                        </Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default GroupList;
