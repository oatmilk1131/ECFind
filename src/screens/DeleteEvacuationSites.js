import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from '../components/Icon';
import styles from '../styles/styles';

export default function DeleteEvacuationSites({ setCurrentScreen }) {
  const initialSites = [
    'Site 1 - Main Evacuation Center',
    'Site 2 - Community Hall',
    'Site 3 - School Gym',
    'Site 4 - Sports Complex',
    'Site 5 - Public Library',
    'Site 6 - Park Pavilion',
    'Site 7 - Emergency Shelter',
    'Site 8 - Community Center',
    'Site 9 - High School Auditorium',
    'Site 10 - Municipal Building'
  ];
  const [sites, setSites] = useState(initialSites);

  const handleDeleteSite = (siteToDelete) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete "${siteToDelete}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSites(sites.filter(site => site !== siteToDelete));
            Alert.alert('Success', 'Evacuation site deleted successfully');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>EVAC SITE DELETION</Text>
        <View style={styles.line} />
      </View>

      <FlatList
        data={sites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleDeleteSite(item)}>
                <Icon name="trash" size={22} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('DeveloperMenu')}>
        <Text style={styles.backText}>Return to menu</Text>
      </TouchableOpacity>
    </View>
  );
}