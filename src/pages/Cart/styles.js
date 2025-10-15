import { StyleSheet } from "react-native";
import { colors } from "../../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  placeholder: {
    width: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.cinza,
    textAlign: "center",
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: colors.laranjaPrincipal,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: colors.laranjaPrincipal,
    fontWeight: "bold",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    paddingHorizontal: 12,
  },
  itemActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.laranjaPrincipal,
  },
  checkoutButton: {
    backgroundColor: colors.laranjaPrincipal,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});