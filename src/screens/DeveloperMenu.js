import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/styles';
export default function DeveloperMenu({ setCurrentScreen }) {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Logged out successfully');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>DEVELOPER MENU</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.centerContent}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentScreen('RegistrationRequests')}
        >
          <Text style={styles.buttonText}>Registration Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentScreen('DeleteEvacuationSites')}
        >
          <Text style={styles.buttonText}>Delete Evacuation Sites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentScreen('AddEvacuationSite')}
        >
          <Text style={styles.buttonText}>Add Evacuation Sites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCurrentScreen('SiteManagerDeletion')}
        >
          <Text style={styles.buttonText}>Site Manager Deletion</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}