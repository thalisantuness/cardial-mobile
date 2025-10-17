// src/pages/Store/styles.js (ATUALIZADO COM PROPAGANDA)
import { StyleSheet, Dimensions, ScrollView } from "react-native";
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonInputSearchLocation: {
    flexDirection: "row",
    flex: 1,
    maxWidth: width * 0.7,
    height: 50,
    backgroundColor: colors.white,
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
  cartButton: {
    position: "relative",
    marginLeft: 10,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.azulPrincipal,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  
  // Seção de Propaganda
  promoContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  promoTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: colors.text,
    marginBottom: 15,
  },
  promoScrollContent: {
    paddingRight: 20,
  },
  promoCard: {
    width: width * 0.8,
    height: 140,
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  promoContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  promoTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  promoCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  promoCardDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginBottom: 10,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 5,
  },
  promoImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  // Estilos existentes mantidos...
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
    backgroundColor: colors.azulPrincipal,
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
  carouselTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.text,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: colors.cinza,
    textAlign: "center",
    padding: 20,
  },
  divPopularLocation: {
    flexDirection: "column",
    width: 290,
    height: 320,
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
    marginLeft: 10,
  },
  imageDecoration: {
    width: 120,
    height: 80,
    borderRadius: 10,
  },
  smallImage: {
    width: 40,
    height: 25,
    borderRadius: 5,
    marginBottom: 5,
  },
  placeholderImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.cinza,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "bold",
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
    color: colors.azulPrincipal,
    fontSize: 16,
  },
  productInfo: {
    marginTop: 10,
  },
  stockInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  stockLabel: {
    fontSize: 14,
    color: colors.text,
    marginRight: 5,
  },
  stockQuantity: {
    fontSize: 14,
    fontWeight: "bold",
  },
  inStock: {
    color: "green",
  },
  lowStock: {
    color: "orange",
  },
  outOfStock: {
    color: "red",
  },
  productCategory: {
    fontSize: 14,
    color: colors.cinza,
  },
  divToLease: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  divQuantityToLease: {
    flexDirection: "row",
  },
  textQuantityNumber: {
    fontWeight: "bold",
    color: colors.text,
    fontSize: 14,
  },
  textLocation: {
    color: colors.cinza,
    paddingLeft: 10,
  },
  buttonToLease: {
    backgroundColor: colors.azulPrincipal,
    height: 40,
    width: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: colors.cinza,
  },
  buttonTextToLease: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
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
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  titlePrice: {
    color: colors.cinza,
    fontWeight: "bold",
  },
  valuePrice: {
    fontWeight: "bold",
    color: colors.azulPrincipal,
  },
  purchaseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  purchaseDate: {
    color: colors.cinza,
    fontSize: 14,
  },
  purchaseStatus: {
    fontWeight: "bold",
    color: "green",
  },
  // Estilos para o modal de busca
  searchResults: {
    width: "100%",
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cinza,
  },
  resultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontWeight: "bold",
    color: colors.text,
    fontSize: 16,
  },
  resultPrice: {
    color: colors.azulPrincipal,
    fontWeight: "bold",
    marginTop: 2,
  },
  resultCategory: {
    color: colors.cinza,
    fontSize: 14,
    marginTop: 2,
  },
  // Estilos para loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: colors.text,
    fontSize: 16,
  },
});