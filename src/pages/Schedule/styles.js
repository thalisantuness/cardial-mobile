import { StyleSheet } from "react-native";
import { colors } from "../../colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.laranjaPrincipal,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  item: {
    backgroundColor: colors.white,
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: colors.cinza,
    marginBottom: 8,
  },
  infoContainer: {
    marginBottom: 8,
  },
  clientText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  driverText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 6,
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  valueText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.laranjaPrincipal,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: colors.cinza,
    marginTop: 50,
  },
});