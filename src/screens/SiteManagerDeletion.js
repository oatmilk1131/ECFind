import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from '../components/Icon';
import styles from '../styles/styles';

export default function SiteManagerDeletion({ setCurrentScreen }) {
  const [users, setUsers] = useState([
    { id: "1", name: "John Doe - Main Center" },
    { id: "2", name: "Jane Smith - Community Hall" },
    { id: "3", name: "Mike Johnson - School Gym" },
    { id: "4", name: "Sarah Wilson - Sports Complex" },
    { id: "5", name: "Tom Brown - Public Library" },
    { id: "6", name: "Emily Davis - Park Pavilion" },
    { id: "7", name: "Robert Lee - Emergency Shelter" },
    { id: "8", name: "Maria Garcia - Community Center" },
  ]);

  const handleViewDetails = (user) => {
    Alert.alert('Manager Info', `Viewing details for: ${user.name}`);
  };

  const handleDelete = (user) => {
    Alert.alert(
      "Delete Site Manager",
      `Are you sure you want to delete "${user.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setUsers(users.filter(u => u.id !== user.id));
            Alert.alert("Success", "Site manager deleted successfully");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>SITE MANAGER DELETION</Text>
        <View style={styles.line} />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Icon name="person-circle-outline" size={24} color="black" />
            <Text style={styles.itemText}>{item.name}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleViewDetails(item)}>
                <Icon name="eye" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Icon name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentScreen('DeveloperMenu')}
      >
        <Text style={styles.backText}>Return to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}