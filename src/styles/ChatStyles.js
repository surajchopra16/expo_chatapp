import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f1e1eff', // Dark background
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 8,
        backgroundColor: '#3D3D3D', 
        borderBottomWidth: 1,
        borderBottomColor: '#4A4A4A',
    },
    backButton: {
        paddingRight: 10,
    },
    backButtonText: {
        color: '#43D0AC', 
        fontSize: 28,
        fontWeight: 'bold',
    },
    titleContainer: {
        flex: 1,
        marginLeft: 10,
    },
    groupTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    onlineStatus: {
        color: '#43D0AC',
        fontSize: 12,
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        paddingHorizontal: 8,
    },
    actionText: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    callIcon: {
        fontSize: 18,
        color: '#43D0AC',
        fontWeight: 'bold',
    },
    moreOptionsButton: {
        paddingLeft: 8,
    },
    moreOptionsText: {
        fontSize: 20, 
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    
    messageListContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginBottom: 10,
        flexDirection: 'column', 
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#43D0AC', 
        borderBottomRightRadius: 2, 
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#3D3D3D', 
        borderBottomLeftRadius: 2, 
    },
    senderName: {
        color: '#B0B0B0', 
        marginBottom: 3,
        fontWeight: 'bold',
    },
    messageText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    timestamp: {
        color: '#D0D0D0', 
        fontSize: 10,
        marginTop: 5,
        alignSelf: 'flex-end', 
    },
    // Input Container Styles
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#4A4A4A',
        backgroundColor: '#3D3D3D', 
    },
    messageInput: {
        flex: 1, 
        backgroundColor: '#2C2C2C', 
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        color: '#FFFFFF',
        fontSize: 16,
        maxHeight: 100, 
        borderWidth: 1,
        borderColor: '#4A4A4A',
    },
    sendButton: {
        backgroundColor: '#43D0AC',
        borderRadius: 25,
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;