import { StyleSheet } from "react-native";
import { colors } from "../../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  firstContainer: {
    backgroundColor: colors.laranjaPrincipal,
    height: "15%",
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  textheader: {
    fontWeight: "bold",
    fontSize: 22,
    color: 'white',
  },
  listContainer: {
    padding: 20,
  },
  solicitacaoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  motoristaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  freteInfo: {
    fontSize: 14,
    color: colors.cinza,
    marginBottom: 10,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    color: 'white',
    textTransform: 'capitalize',
  },
  status_pendente: {
    backgroundColor: '#f0ad4e', // Amarelo
  },
  status_aceita: {
    backgroundColor: '#5cb85c', // Verde
  },
  
  status_rejeitada: {
    backgroundColor: '#d9534f', // Vermelho
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  botaoAceitar: {
    backgroundColor: colors.verde,
    marginRight: 10,
  },
  botaoRecusar: {
    backgroundColor: colors.vermelho,
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.cinza,
  },
});
