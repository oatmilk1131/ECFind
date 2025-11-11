import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from '../components/Icon';
import styles from '../styles/styles';
import { useDatabase } from '../context/DatabaseContext';

export default function DeleteEvacuationSites({ navigation }) {
  const { evacSites, removeEvacSite } = useDatabase();

  const sites = useMemo(
    () =>
      evacSites.map((site) => ({
        id: site.id,
        title: site.name,
        subtitle: site.address,
      })),
    [evacSites]
  );

  const handleDeleteSite = (site) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete "${site.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeEvacSite(site.id),
        },
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listText}>{item.title}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>{item.subtitle}</Text>
            </View>
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
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#6b7280' }}>No evacuation sites to remove.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('DeveloperMenu')}>
        <Text style={styles.backText}>Return to menu</Text>
      </TouchableOpacity>
    </View>
  );
}
