import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../colors.js";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  modalButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  buttonModal: {
    backgroundColor: colors.azulPrincipal,
    height: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },

  buttonModalDecline: {
    backgroundColor: 'red',
    height: 30,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },

  buttonModalText: {
    color: "white", 
    fontWeight: "bold",
  },

  firstContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.azulPrincipal,
    height: "20%",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  textheader: {
    fontWeight: "bold",
    fontSize: 22,
    color: 'white',
  },

  secondContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 30,
    paddingTop: 20,
    marginBottom: 20,
  },

  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: colors.text,
  },

  subtitle: {
    fontWeight: "400",
    fontSize: 14,
    color: colors.cinza,
    marginTop: 5,
  },

  viewWelcome: {
    backgroundColor: colors.azulPrincipal,
    height: 150,
    width: '90%',
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  welcomeTextContainer: {
    flex: 1,
  },

  welcomeTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
    marginBottom: 5,
  },

  welcomeSubtitle: {
    fontWeight: "400",
    fontSize: 14,
    color: "#FFD699", // Tom mais claro de laranja
  },

  imageTrucker: {
    height: 120,
    width: 120,
  },

  viewOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 20,
  },

  optionButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  optionIconContainer: {
    backgroundColor: "#FFEEDD", // Fundo claro para os ícones
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  optionText: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.text,
  },
});