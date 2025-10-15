import { StyleSheet } from 'react-native';
import { colors } from '../../colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.laranjaPrincipal,
    height: 90,
    paddingHorizontal: 15,
    paddingTop: 40,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightPlaceholder: {
    width: 30,
  },
  scrollContainer: {
    padding: 20,
  },
  detailRow: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: colors.cinza,
    flex: 1,
    textAlign: 'right',
  },
  infoText: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 18,
      color: colors.cinza
  },
  actionButton: {
    backgroundColor: colors.verde,
    padding: 18,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  empresaActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  editButton: {
    backgroundColor: colors.laranjaPrincipal,
    flex: 1,
    marginHorizontal: 5
  },
  deleteButton: {
    backgroundColor: colors.vermelho,
    flex: 1,
    marginHorizontal: 5
  },
});

