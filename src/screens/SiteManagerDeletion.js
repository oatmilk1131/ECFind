import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from '../components/Icon';
import styles from '../styles/styles';
import { useDatabase } from '../context/DatabaseContext';

export default function SiteManagerDeletion({ navigation }) {
  const { siteManagers, removeSiteManager } = useDatabase();

  const data = useMemo(
    () =>
      siteManagers.map((manager) => ({
        id: manager.id,
        name: manager.user?.name ?? 'Unknown manager',
        siteName: manager.site?.name ?? 'Unassigned',
        contactNumber: manager.user?.contactNumber ?? 'N/A',
      })),
    [siteManagers]
  );

  const handleViewDetails = (manager) => {
    Alert.alert(
      manager.name,
      `Assigned site: ${manager.siteName}\nContact: ${manager.contactNumber}`,
      [{ text: 'Close', style: 'default' }]
    );
  };

  const handleDelete = (manager) => {
    Alert.alert(
      'Delete Site Manager',
      `Remove ${manager.name} from the directory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeSiteManager(manager.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>SITE MANAGERS</Text>
        <View style={styles.line} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Icon name="person-circle-outline" size={24} color="black" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>Site: {item.siteName}</Text>
            </View>
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
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#6b7280' }}>No site managers recorded.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('DeveloperMenu')}
      >
        <Text style={styles.backText}>Return to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
