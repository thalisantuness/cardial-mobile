import { StyleSheet } from 'react-native';
import { colors } from '../../colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cinzaClaro,
    paddingBottom: 5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    justifyContent: 'center', // Para alinhar o texto do picker
  },
  inputDisabled: {
      backgroundColor: '#E0E0E0'
  },
  textArea: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  checkboxGroupRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Para que os checkboxes fiquem em duas colunas
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.laranjaPrincipal,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: colors.laranjaPrincipal,
  },
  checkboxLabel: {
    fontSize: 16,
    flexShrink: 1, // Permite que o texto quebre a linha se necessário
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: colors.laranjaPrincipal,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos para o Modal de Localidades
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: "90%",
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
  },
});

