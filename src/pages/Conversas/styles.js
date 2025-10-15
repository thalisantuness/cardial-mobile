import { StyleSheet } from "react-native";
import { colors } from "../../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  firstContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.laranjaPrincipal,
    height: "20%",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  textheader: {
    fontWeight: "bold",
    fontSize: 22,
    color: colors.background,
  },
  secondContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 30,
    paddingTop: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    fontWeight: "400",
    fontSize: 18,
    color: "#000000",
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  conversaItem: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 20,
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    padding: 15,
  },
  addConversaIcon: {
    color: "#ffffff",
  },
  overlay: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  conversaTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.text,
  },
  conversaSubtitle: {
    fontWeight: "400",
    fontSize: 12,
    color: colors.cinza,
  },
  noConversasText: {
    fontSize: 16,
    color: colors.cinza,
    textAlign: "center",
    marginTop: 20,
  },
});
