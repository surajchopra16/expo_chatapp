import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1f1e1eff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: 60,
        right: 30,
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
        borderWidth: 1,
        marginBottom: 0,
        marginTop: -22,
        marginRight: 0,
    },
    shieldText: {
        color: '#43D0AC',
        fontSize: 20,
        fontWeight: 'bold',
    },
    secureLabel: {
        color: '#43D0AC',
        fontSize: 12,
        marginTop: 5,
    },
    formContainer: {
        width: '85%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginLeft: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#B0B0B0',
        marginBottom: 30,
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
    loginButton: {
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
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 30,
    },
    footerText: {
        color: '#B0B0B0',
        fontSize: 14,
    },
    linkText: {
        color: '#43D0AC',
        fontWeight: 'bold',
    }
});

export default styles; 