import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f1e1eff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop:30,
        paddingBottom: 0,
    },
    backButton: {
        color: '#FFFFFF',
        fontSize: 30,
    },
    secureIconContainer: {
        alignItems: 'center',
    },
    shieldIcon: {
        width: 44,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(67, 208, 172, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#43D0AC',
        borderWidth: 2,
        marginBottom: 0,
        marginTop: -20,
        marginRight: 0,
    },
    shieldText: {
        color: '#43D0AC',
        fontSize: 19,
        fontWeight: 'bold',
    },
    secureLabel: {
        color: '#43D0AC',
        fontSize: 12,
        marginTop: 4,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: '7.5%', 
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#B0B0B0',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 55,
        backgroundColor: '#3D3D3D',
        borderRadius: 12,
        borderColor: '#43D0AC',
        borderWidth: 1,
        paddingHorizontal: 15,
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 20,
    },
    passwordContainer: {
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        height: '100%',
        justifyContent: 'center',
        paddingBottom: 20, 
    },
    eyeText: {
        fontSize: 20
    },
    registerButton: {
        width: '100%',
        height: 55,
        backgroundColor: '#43D0AC',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    encryptionNote: {
        color: '#43D0AC',
        fontSize: 14,
        marginTop: 15,
        textAlign: 'center'
    }
});

export default styles;