import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    justifyContent: "center",
    backgroundColor: "#FFFFFF", // Fundo branco
  },
  welcomeText: {
    marginTop: 50,
    fontSize: width * 0.07,
    marginBottom: 10,
    color: "#1E232C",
    fontWeight: "bold",
  },
  inputField: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#E8ECF4",
    borderRadius: width * 0.02,
    height: 70,
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  input: {
    width: "85%",
    height: 50,
    padding: 8,
    fontSize: 16,
  },
  icon: {
    width: "15%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    height: height * 0.08,
    backgroundColor: "#ff6600", // Botão laranja
    justifyContent: "center",
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    marginBottom: 60,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.04,
    textAlign: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  register: {
    flexDirection: "row",
    alignSelf: "center",
    color: "#6A707C",
  },
  linkregister: {
    height: 30,
  },
  register2: {
    alignSelf: "center",
    color: "#FEAB13",
    fontWeight: "bold",
  },
});