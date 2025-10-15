import { StyleSheet } from "react-native";
import { colors } from "../../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginLeft: 5,
    marginRight: 10,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.cinza,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.laranjaPrincipal,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  stockContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#E8F5E8",
    borderRadius: 8,
  },
  stockText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginRight: 16,
  },
  quantityButton: {
    padding: 12,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    paddingHorizontal: 20,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.laranjaPrincipal,
    padding: 16,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: colors.cinza,
  },
  addToCartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  totalPrice: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});