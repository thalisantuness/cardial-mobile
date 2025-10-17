import { StyleSheet } from "react-native";
import { colors } from "../../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.azulPrincipal,
    height: 90,
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerRightPlaceholder: {
    width: 35,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  mensagemContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  mensagemBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 18,
    marginBottom: 5,
  },
  currentUserBubble: {
    backgroundColor: colors.azulPrincipal,
    borderTopRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 4,
  },
  mensagemText: {
    fontSize: 16,
  },
  currentUserText: {
    color: 'white',
  },
  otherUserText: {
    color: colors.text,
  },
  mensagemTime: {
    fontSize: 12,
    color: colors.cinza,
    marginTop: 4,
    textAlign: 'right',
  },
  naoLida: {
    fontSize: 11,
    color: colors.azulPrincipal,
    fontStyle: 'italic',
    marginLeft: 10,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text,
  },
  sendButton: {
    marginLeft: 10,
    padding: 8,
  },
  documentButton: {
  padding: 10,
  justifyContent: 'center',
  alignItems: 'center',
},
});