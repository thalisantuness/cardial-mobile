import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  servicesButton: {
    backgroundColor: "#3182CE",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#3182CE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  servicesButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#3182CE",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3182CE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },

  // Card Styles
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F7FAFC",
  },

  // Card Header
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  idContainer: {
    flex: 1,
    marginRight: 12,
  },
  idText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3182CE",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Image
  imageContainer: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#F7FAFC',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },

  // Service Info
  serviceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9AE6B4',
  },
  valueText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#38A169",
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D6BCFA',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#805AD5",
    marginLeft: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BEE3F8',
  },
  durationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3182CE",
    marginLeft: 4,
  },

  // Info Sections
  infoSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A202C",
    marginLeft: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#2D3748",
    marginBottom: 4,
    lineHeight: 18,
  },
  infoLabel: {
    fontWeight: "600",
    color: "#000000",
  },

  // Date and Time
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3182CE",
    marginLeft: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3182CE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 6,
  },

  // Notes Section
  notesSection: {
    backgroundColor: '#FFFAF0',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D69E2E',
    marginBottom: 16,
  },
  notesText: {
    fontSize: 13,
    color: "#2D3748",
    lineHeight: 18,
  },

  // Card Footer
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 11,
    color: "#A0AEC0",
    marginBottom: 2,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    textAlign: "center",
    fontSize: 14,
    color: "#A0AEC0",
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: "#3182CE",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
