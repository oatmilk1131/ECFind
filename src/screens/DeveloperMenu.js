import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { loadDevelopers } from '../utils/dataService';
import styles from '../styles/styles';

export default function DeveloperMenu({ navigation }) {
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    const data = loadDevelopers();
    setDevelopers(data.developers);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View className="flex-row justify-between items-center px-4 mt-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-blue-600 font-semibold">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Text className="text-blue-600 font-semibold">Profile</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Development Team</Text>
      <FlatList
        data={developers}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.devCard}>
            <Text style={styles.devName}>{item.name}</Text>
            <Text style={styles.devRole}>{item.role}</Text>
            <Text style={styles.devEmail}>{item.email}</Text>
            <Text style={styles.devGithub}>{item.github}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}
