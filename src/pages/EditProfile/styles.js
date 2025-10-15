import { StyleSheet } from 'react-native';
import { colors } from '../../colors';

export default StyleSheet.create({
    // ... (estilos existentes)
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.laranjaPrincipal,
        height: 90,
        paddingHorizontal: 15,
        paddingTop: 40,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerRightPlaceholder: {
        width: 30,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 5,
    },
    subSectionText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.cinza,
        marginBottom: 10,
        marginTop: 5,
    },
    input: {
        backgroundColor: "#E8ECF4",
        marginBottom: 15,
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 16,
    },
    inputDisabled: {
        backgroundColor: '#E0E0E0',
        color: '#757575'
    },
    pickerContainer: {
        backgroundColor: "#E8ECF4",
        marginBottom: 15,
        width: '100%',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pickerText: {
        fontSize: 16,
        color: 'black'
    },
    pickerArrow: {
        fontSize: 16,
        color: 'black'
    },
    saveButton: {
        backgroundColor: colors.laranjaPrincipal,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    passwordButton: {
        backgroundColor: colors.cinza, // Cor diferente para o botão de senha
        marginTop: 15,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.cinza,
        marginTop: 30,
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        width: "80%",
        paddingVertical: 10,
    },
    modalOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E8ECF4",
    },
    modalOptionText: {
        fontSize: 16,
        color: "#000000",
        textAlign: 'center'
    },

    // --- NOVOS ESTILOS PARA EDIÇÃO DE DOCUMENTOS ---
    documentContainer: {
        marginBottom: 15,
    },
    documentLabel: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 8,
        fontWeight: '500',
    },
    documentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    documentPreview: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
    },
    documentPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeButton: {
        backgroundColor: colors.laranjaPrincipal,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginLeft: 'auto',
    },
    changeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    }
});

