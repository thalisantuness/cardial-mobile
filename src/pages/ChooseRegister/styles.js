import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    justifyContent: "space-evenly",
    backgroundColor: "#ffffff",
  },

  welcomeText: {
    marginTop: 50,
    fontSize: width * 0.07,
    marginBottom: 10,
    color: "#1E232C",
    fontWeight: "bold",
  },

  loginButton: {
    height: height * 0.08,
    backgroundColor: "#ff6600",
    justifyContent: "center",
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    marginBottom: 60,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  buttonText: {
    color: "white",
    fontSize: width * 0.04,
    textAlign: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
});
