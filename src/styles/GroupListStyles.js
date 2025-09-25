import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f1e1eff',
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    menuIcon: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    headerSpacer: {
        width: 24, // Same width as menuIcon to center the title
    },
    // Search Bar Styles
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    searchInput: {
        backgroundColor: '#3D3D3D',
        borderRadius: 12,
        height: 50,
        paddingHorizontal: 15,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#4A4A4A',
    },
    // List Styles
    listContainer: {
        flex: 1,
    },
    // Group Item Styles
    groupItemContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
    },
    groupIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#43D0AC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    groupIconText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    groupTextContainer: {
        flex: 1,
    },
    groupName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    lastMessage: {
        color: '#B0B0B0',
        fontSize: 14,
    },
    groupMetaContainer: {
        alignItems: 'flex-end',
    },
    timestamp: {
        color: '#8A8A8A',
        fontSize: 12,
        marginBottom: 8,
    },
    unreadBadge: {
        backgroundColor: '#43D0AC',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default styles;