import { StyleSheet } from "react-native";
import { colors } from "../../colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  productsButton: {
    backgroundColor: colors.azulPrincipal,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  productsButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyMessage: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.cinza,
    marginTop: 10,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: colors.azulPrincipal,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  item: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    flexDirection: "row",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 12,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },
  description: {
    fontSize: 14,
    color: colors.cinza,
    marginBottom: 8,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: "#385b3e",
    marginLeft: 6,
    fontWeight: "500",
  },
  valueContainer: {
    marginTop: 4,
  },
  valueText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.azulPrincipal,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f0f8ff",
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.azulPrincipal,
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: "#ffe5e5",
  },
  deleteButtonText: {
    color: "#DC143C",
  },
});

export default styles;

