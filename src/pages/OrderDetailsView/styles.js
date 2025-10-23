import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../colors";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  headerRight: {
    width: 34,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.cinza,
  },
  productImage: {
    width: width,
    height: 300,
    backgroundColor: "#f5f5f5",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.azulPrincipal,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.cinza,
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    textAlign: "right",
    flex: 1,
  },
  observacaoBox: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.azulPrincipal,
  },
  observacaoText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginLeft: 10,
    flex: 1,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productDetailLabel: {
    fontSize: 14,
    color: colors.cinza,
  },
  productDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  deleteButton: {
    backgroundColor: "#DC143C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default styles;

