// src/pages/Store/styles.js
import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  divSearchNotify: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonInputSearchLocation: {
    flexDirection: "row",
    width: width * 0.8,
    height: 50,
    backgroundColor: "#FFEEDD",
    borderRadius: 25,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  inputSearchPlaceholder: {
    flex: 1,
    color: colors.cinza,
    fontSize: 16,
  },
  divLocalization: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
    paddingLeft: 30,
    marginBottom: 10,
  },
  textLocalization: {
    color: colors.cinza,
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  viewModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  viewContentModal: {
    backgroundColor: colors.background,
    padding: 20,
    width: "90%",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerModal: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleModal: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.text,
  },
  modalLabelForm: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  modalIconForm: {
    marginRight: 10,
  },
  inputModal: {
    borderBottomWidth: 2,
    borderBottomColor: colors.cinza,
    padding: 5,
    width: width * 0.7,
    color: colors.text,
    fontSize: 16,
  },
  buttonSearchPlace: {
    backgroundColor: colors.laranjaPrincipal,
    height: 50,
    width: width * 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 10,
  },
  buttonTextSearchPlace: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Estilos para CarrouselTopPlaces
  carouselContainer: {
    flex: 1,
    marginVertical: 10,
  },
  carouselContentContainer: {
    paddingHorizontal: 20,
  },
  divPopularLocation: {
    flexDirection: "column",
    width: 290,
    height: 300,
    borderRadius: 15,
    padding: 15,
    justifyContent: "space-around",
    marginLeft: 10,
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  divImages: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divAlternativeImages: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  imageDecoration: {
    width: 120,
    height: 80,
    borderRadius: 10,
  },
  divInfoLocation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  textLocationTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.text,
    flex: 1,
  },
  textLocationPrice: {
    fontWeight: "bold",
    color: colors.laranjaPrincipal,
    fontSize: 16,
  },
  divToLease: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divQuantityToLease: {
    flexDirection: "row",
  },
  textQuantityNumber: {
    fontWeight: "bold",
    color: colors.text,
  },
  textLocation: {
    color: colors.cinza,
    paddingLeft: 10,
  },
  buttonToLease: {
    backgroundColor: colors.laranjaPrincipal,
    height: 40,
    width: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonTextToLease: {
    color: "white",
    fontWeight: "bold",
  },
  // Estilos para CardHistoric
  cardHistoricContainer: {
    flex: 1,
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  cardHistoric: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFEEDD",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  titleHistoricCard: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.text,
    marginBottom: 10,
  },
  freightImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  infoHistoric: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "60%",
  },
  titlePlaceHistoric: {
    fontWeight: "bold",
    fontSize: 17,
    color: colors.text,
  },
  titlePrice: {
    color: colors.cinza,
    fontWeight: "bold",
  },
  valuePrice: {
    fontWeight: "bold",
    color: colors.laranjaPrincipal,
  },
  infoUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarUser: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  infoUserDetails: {
    flex: 1,
    flexDirection: "column",
  },
  userName: {
    fontWeight: "600",
    color: colors.text,
  },
  userHandle: {
    color: colors.cinza,
    fontSize: 14,
  },
  buttonDetails: {
    marginLeft: 10,
  },
  textDetails: {
    color: colors.laranjaPrincipal,
    fontWeight: "bold",
  },
});