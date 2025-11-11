import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';
import { useDatabase } from '../context/DatabaseContext';
import Icon from '../components/Icon';

export default function UsersDirectoryScreen({ navigation }) {
  const { users } = useDatabase();

  const items = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        contactNumber: user.contactNumber,
      })),
    [users]
  );

  return (
    <View style={styles.container}>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>USERS DIRECTORY</Text>
        <View style={styles.line} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Icon name="person" size={22} color="black" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>@{item.username} • {item.role}</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>{item.contactNumber}</Text>
            </View>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#6b7280' }}>No registered users.</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('DeveloperMenu')}>
        <Text style={styles.backText}>Return to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
