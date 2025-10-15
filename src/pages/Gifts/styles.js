import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../colors";

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Header Styles
  firstContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.laranjaPrincipal,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 40,
  },
  textheader: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },

  // Welcome Section
  secondContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.cinza,
  },

  // Hero Section
  viewWelcome: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.laranjaPrincipal,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  imageTrucker: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  // Stats Cards
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    padding: 15,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.cinza,
  },

  // Sections
  section: {
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.laranjaPrincipal,
    fontWeight: "500",
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 48) / 2,
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.cinza,
    textAlign: "center",
  },

  // Rewards Section
  rewardsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  rewardCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  rewardImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pointsText: {
    fontSize: 12,
    color: colors.laranjaPrincipal,
    fontWeight: "500",
    marginLeft: 4,
  },
  redeemButton: {
    backgroundColor: colors.laranjaPrincipal,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  redeemButtonDisabled: {
    backgroundColor: colors.cinza,
  },
  redeemButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },

  // How it Works
  howItWorks: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.laranjaPrincipal,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});