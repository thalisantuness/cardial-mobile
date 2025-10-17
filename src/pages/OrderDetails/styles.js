// src/pages/OrderDetails/styles.js (ATUALIZADO)
import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../colors";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  placeholderImage: {
    backgroundColor: colors.cinza,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "bold",
  },
  thumbnailsContainer: {
    paddingVertical: 15,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  thumbnailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.cinza,
    marginBottom: 10,
    marginLeft: 15,
    textAlign: 'center',
  },
  thumbnailsList: {
    paddingHorizontal: 15,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeThumbnail: {
    borderColor: colors.azulPrincipal,
    borderWidth: 3,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  content: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 5,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.cinza,
    marginLeft: 5,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.azulPrincipal,
    marginBottom: 20,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 14,
    color: colors.cinza,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'justify',
  },
  stockContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inStock: {
    color: 'green',
  },
  outOfStock: {
    color: 'red',
  },
  footer: {
    backgroundColor: colors.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  quantitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 5,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  disabledQuantityButton: {
    backgroundColor: '#f0f0f0',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: colors.azulPrincipal,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: colors.cinza,
  },
  addToCartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginLeft: 10,
  },
  totalPrice: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});