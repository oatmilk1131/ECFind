import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  lowerHeader: {
    alignItems: 'center',
    paddingTop: height * 0.05,
    paddingBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scrollContent: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  line: {
    width: '60%',
    height: 2,
    backgroundColor: '#333',
    marginVertical: 10
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 50,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 150,
    justifyContent: 'center',
    minHeight: 50,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  button: {
    backgroundColor: '#FFA500',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    width: width * 0.8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  successBox: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  successText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center'
  },
  resetButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 15,
    minHeight: 44,
    justifyContent: 'center',
  },
  resetText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  logoutButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
    minHeight: 44,
    justifyContent: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  listItem: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 60,
  },
  listText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 15
  },
  dropdownContainer: {
    width: 160,
    position: "relative", // Important for absolute positioning inside
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownButtonText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
  },
  dropdownList: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 10, // Android shadow
    zIndex: 1000, // iOS stacking
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#333",
  },
});