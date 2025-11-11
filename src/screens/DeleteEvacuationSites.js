import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from '../components/Icon';
import styles from '../styles/styles';
import { loadEvacuationSites, deleteEvacuationSite } from '../utils/dataService';
import { useAuth } from '../context/Auth';
import StyleButton from '../components/StyleButton';
import BackArrow from '../components/BackArrow';

export default function DeleteEvacuationSites({ navigation }) {
  const { user } = useAuth();
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const data = loadEvacuationSites();
    setSites(data.sites ?? []);
  }, []);

  const handleDeleteSite = (site) => {
    Alert.alert(
      'Confirm Deletion',
      `Delete "${site.name}" from the evacuation site list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEvacuationSite(site.id);
            setSites((prev) => prev.filter((item) => item.id !== site.id));
            Alert.alert('Deleted', 'Evacuation site removed.');
          }
        }
      ]
    );
  };

  if (!['admin', 'developer'].includes(user?.role)) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Text className="text-lg font-semibold mb-4 text-center">
          Only administrators can delete evacuation sites.
        </Text>
        <StyleButton title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View className="flex-row justify-between items-center px-4 mt-4">
        <BackArrow />
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Text className="text-blue-600 font-semibold">Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>EVAC SITE DELETION</Text>
        <View style={styles.line} />
      </View>

      <FlatList
        data={sites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.name}</Text>
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
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">No sites available.</Text>
        }
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Return to menu</Text>
      </TouchableOpacity>
    </View>
  );
}
