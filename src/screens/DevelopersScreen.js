import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';
import { useDatabase } from '../context/DatabaseContext';
import Icon from '../components/Icon';

export default function DevelopersScreen({ navigation }) {
  const { developers } = useDatabase();

  const items = useMemo(
    () =>
      developers.map((developer) => ({
        id: developer.id,
        name: developer.user?.name ?? 'Developer',
        contactNumber: developer.user?.contactNumber ?? 'N/A',
        title: developer.title ?? 'Team member',
      })),
    [developers]
  );

  return (
    <View style={styles.container}>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>DEVELOPERS</Text>
        <View style={styles.line} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Icon name="code-slash" size={22} color="black" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>{item.title}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>{item.contactNumber}</Text>
            </View>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#6b7280' }}>No registered developers.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('DeveloperMenu')}>
        <Text style={styles.backText}>Return to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
